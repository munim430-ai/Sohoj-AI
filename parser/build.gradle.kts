plugins {
    kotlin("jvm") version "2.0.21"
}

repositories { mavenCentral() }

dependencies {
    testImplementation(kotlin("test"))
    testImplementation(kotlin("reflect"))
}

kotlin { jvmToolchain(21) }

tasks.test { useJUnitPlatform() }
