package com.parentguard.accessibility

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import com.parentguard.overlay.OverlayController
import com.parentguard.usage.BlockedAppsStore

class ParentGuardAccessibilityService : AccessibilityService() {
  override fun onServiceConnected() {
    super.onServiceConnected()
    serviceInfo = serviceInfo.apply {
      eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED or
        AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED
      feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
      flags = flags or AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS
      notificationTimeout = 100
    }
    instance = this
  }

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    if (event == null) return
    val packageName = event.packageName?.toString() ?: return
    if (packageName == applicationContext.packageName) {
      OverlayController.hide(this)
      return
    }

    if (BlockedAppsStore.isBlocked(packageName)) {
      OverlayController.show(this, packageName)
      // Best-effort return to home; OS may still allow brief glimpses of the target app.
      performGlobalAction(GLOBAL_ACTION_HOME)
    } else {
      OverlayController.hide(this)
    }
  }

  override fun onInterrupt() {
    OverlayController.hide(this)
  }

  override fun onUnbind(intent: Intent?): Boolean {
    instance = null
    OverlayController.hide(this)
    return super.onUnbind(intent)
  }

  companion object {
    @Volatile
    var instance: ParentGuardAccessibilityService? = null
      private set

    fun isEnabled(): Boolean = instance != null
  }
}
