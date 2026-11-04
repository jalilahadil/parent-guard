package com.parentguard.overlay

import android.content.Context
import android.graphics.PixelFormat
import android.os.Build
import android.provider.Settings
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.TextView
import com.parentguard.app.R

object OverlayController {
  private var overlayView: View? = null

  fun canDrawOverlays(context: Context): Boolean {
    return Settings.canDrawOverlays(context)
  }

  fun show(context: Context, packageName: String) {
    if (!canDrawOverlays(context)) return
    if (overlayView != null) return

    val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    val type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
    } else {
      @Suppress("DEPRECATION")
      WindowManager.LayoutParams.TYPE_PHONE
    }

    val params = WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT,
      WindowManager.LayoutParams.MATCH_PARENT,
      type,
      WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
        WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
        WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
      PixelFormat.TRANSLUCENT,
    )
    params.gravity = Gravity.CENTER

    val view = LayoutInflater.from(context).inflate(R.layout.parentguard_block_overlay, null)
    view.findViewById<TextView>(R.id.overlayMessage)?.text =
      "This app is blocked by ParentGuard.\n($packageName)"

    windowManager.addView(view, params)
    overlayView = view
  }

  fun hide(context: Context) {
    val view = overlayView ?: return
    val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    runCatching { windowManager.removeView(view) }
    overlayView = null
  }
}
