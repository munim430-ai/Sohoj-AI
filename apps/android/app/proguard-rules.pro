# Keep Room generated code
-keep class * extends androidx.room.RoomDatabase { <init>(); }
-keepclassmembers class * { @androidx.room.* <methods>; }
# Retrofit / Gson DTOs
-keep class ai.sohoj.app.sync.** { *; }
-keepattributes Signature, *Annotation*
