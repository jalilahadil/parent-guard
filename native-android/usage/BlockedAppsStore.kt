package com.parentguard.usage

import android.content.Context
import android.content.SharedPreferences

object BlockedAppsStore {
  private const val PREFS = "parentguard_blocked_apps"
  private const val KEY = "packages"
  private var memoryCache: Set<String> = emptySet()

  fun init(context: Context) {
    memoryCache = prefs(context).getStringSet(KEY, emptySet())?.toSet() ?: emptySet()
  }

  fun sync(context: Context, packages: List<String>) {
    memoryCache = packages.toSet()
    prefs(context).edit().putStringSet(KEY, memoryCache).apply()
  }

  fun isBlocked(packageName: String): Boolean = memoryCache.contains(packageName)

  fun snapshot(): Set<String> = memoryCache

  private fun prefs(context: Context): SharedPreferences =
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
}
