package com.parentguard.usage

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import com.parentguard.accessibility.ParentGuardAccessibilityService
import com.parentguard.app.R
import com.parentguard.overlay.OverlayController

/**
 * Foreground service that periodically cross-checks UsageStats.
 * Primary blocking still comes from AccessibilityService events (not JS timers).
 */
class MonitoringForegroundService : Service() {
  private val handler = Handler(Looper.getMainLooper())
  private val tick = object : Runnable {
    override fun run() {
      val pkg = UsageStatsHelper.getForegroundPackage(this@MonitoringForegroundService)
      if (pkg != null && BlockedAppsStore.isBlocked(pkg)) {
        OverlayController.show(this@MonitoringForegroundService, pkg)
        ParentGuardAccessibilityService.instance?.performGlobalAction(
          android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_HOME,
        )
      }
      handler.postDelayed(this, 2_000L)
    }
  }

  override fun onCreate() {
    super.onCreate()
    BlockedAppsStore.init(this)
    createChannel()
    startForeground(NOTIFICATION_ID, buildNotification())
    handler.post(tick)
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int = START_STICKY

  override fun onDestroy() {
    handler.removeCallbacks(tick)
    OverlayController.hide(this)
    super.onDestroy()
  }

  override fun onBind(intent: Intent?): IBinder? = null

  private fun createChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val manager = getSystemService(NotificationManager::class.java)
    val channel = NotificationChannel(
      CHANNEL_ID,
      "ParentGuard Monitoring",
      NotificationManager.IMPORTANCE_LOW,
    )
    manager.createNotificationChannel(channel)
  }

  private fun buildNotification(): Notification {
    return NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("ParentGuard is active")
      .setContentText("Monitoring restricted apps on this device")
      .setSmallIcon(R.mipmap.ic_launcher)
      .setOngoing(true)
      .build()
  }

  companion object {
    private const val CHANNEL_ID = "parentguard_monitoring"
    private const val NOTIFICATION_ID = 42001

    fun start(context: Context) {
      val intent = Intent(context, MonitoringForegroundService::class.java)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(intent)
      } else {
        context.startService(intent)
      }
    }

    fun stop(context: Context) {
      context.stopService(Intent(context, MonitoringForegroundService::class.java))
    }
  }
}
