package com.parentguard.modules

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.parentguard.accessibility.ParentGuardAccessibilityService
import com.parentguard.overlay.OverlayController
import com.parentguard.usage.BlockedAppsStore
import com.parentguard.usage.MonitoringForegroundService
import com.parentguard.usage.UsageStatsHelper

@ReactModule(name = ParentGuardNativeModule.NAME)
class ParentGuardNativeModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  @ReactMethod
  fun getPermissionStatus(promise: Promise) {
    try {
      val map = Arguments.createMap()
      map.putBoolean("accessibility", isAccessibilityEnabled())
      map.putBoolean("usageStats", UsageStatsHelper.hasUsageAccess(reactContext))
      map.putBoolean("overlay", OverlayController.canDrawOverlays(reactContext))
      map.putBoolean(
        "notifications",
        if (Build.VERSION.SDK_INT >= 33) {
          reactContext.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) ==
            android.content.pm.PackageManager.PERMISSION_GRANTED
        } else {
          true
        },
      )
      promise.resolve(map)
    } catch (e: Exception) {
      promise.reject("PERMISSION_STATUS_ERROR", e)
    }
  }

  @ReactMethod
  fun openAccessibilitySettings(promise: Promise) {
    try {
      val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactContext.startActivity(intent)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("OPEN_ACCESSIBILITY_ERROR", e)
    }
  }

  @ReactMethod
  fun openUsageAccessSettings(promise: Promise) {
    try {
      UsageStatsHelper.openUsageAccessSettings(reactContext)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("OPEN_USAGE_ERROR", e)
    }
  }

  @ReactMethod
  fun openOverlaySettings(promise: Promise) {
    try {
      val intent = Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:${reactContext.packageName}"),
      ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactContext.startActivity(intent)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("OPEN_OVERLAY_ERROR", e)
    }
  }

  @ReactMethod
  fun startMonitoringService(promise: Promise) {
    try {
      MonitoringForegroundService.start(reactContext)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("START_MONITOR_ERROR", e)
    }
  }

  @ReactMethod
  fun stopMonitoringService(promise: Promise) {
    try {
      MonitoringForegroundService.stop(reactContext)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("STOP_MONITOR_ERROR", e)
    }
  }

  @ReactMethod
  fun syncBlockedPackages(packages: ReadableArray, promise: Promise) {
    try {
      val list = mutableListOf<String>()
      for (i in 0 until packages.size()) {
        packages.getString(i)?.let { list.add(it) }
      }
      BlockedAppsStore.sync(reactContext, list)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("SYNC_BLOCKED_ERROR", e)
    }
  }

  @ReactMethod
  fun getForegroundApp(promise: Promise) {
    try {
      promise.resolve(UsageStatsHelper.getForegroundPackage(reactContext))
    } catch (e: Exception) {
      promise.reject("FOREGROUND_APP_ERROR", e)
    }
  }

  private fun isAccessibilityEnabled(): Boolean {
    if (ParentGuardAccessibilityService.isEnabled()) return true
    val enabled = Settings.Secure.getString(
      reactContext.contentResolver,
      Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
    ) ?: return false
    val expected = "${reactContext.packageName}/${ParentGuardAccessibilityService::class.java.name}"
    return enabled.split(':').any { it.equals(expected, ignoreCase = true) }
  }

  companion object {
    const val NAME = "ParentGuardNative"
  }
}
