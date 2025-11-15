# 🎵 Akisum – Reverse Music Guessing Game

[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)]()
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)]()
[![ShadCN UI](https://img.shields.io/badge/ShadCN_UI-000000)]()
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-FF4081)]()
[![Firebase Hosting](https://img.shields.io/badge/Firebase_Hosting-FFCA28?logo=firebase&logoColor=black)]()
[![Try Me](https://img.shields.io/badge/Try_it_on_Akisum.com-6C63FF)](https://akisum.com)

**Akisum** (from *“música”* spelled backwards) is a fast‑paced, competitive audio-based game where players try to identify a song after hearing only its **reversed** version.  
One player records a short music fragment, the system reverses it, and the opponent must imitate the reversed audio. The system then flips that imitation again, producing an approximation of the original song — which the opponent must guess.

---

## 🚀 Features

- 🎙️ **In-browser audio recording** using the Web Audio API  
- 🔄 **Instant audio reversal** for both the original fragment and the player's imitation  
- 🎧 **Playback controls** for original, reversed, and double‑reversed audio  
- 🕹️ **Gameplay flow suitable for 1v1 or team rounds**  
- 🧩 **Modern UI** powered by Tailwind CSS + ShadCN  
- ⚡ **High-performance client-side app** built with Next.js and TypeScript  
- ☁️ **Hosted on Firebase Hosting** for global scale

---

## 🕹️ How It Works

1. **Player A** records up to **6 seconds** of a song.  
2. The app **locks** the recording and generates an instant reversed version.  
3. **Player B** listens to the reversed clip and memorizes its pattern.  
4. Player B **records an imitation** of the reversed fragment.  
5. The system reverses Player B’s imitation, revealing how close it sounds to the original.  
6. Player B makes their final guess — or gives up.

---

## 🛠️ Tech Stack

- **Next.js 14** – App Router, server components  
- **TypeScript** – type‑safe logic  
- **Tailwind CSS** – utility-first styling  
- **ShadCN UI** – beautiful and accessible components  
- **Web Audio API** – real-time audio capture and processing  
- **Firebase Hosting** – fast global deployment

---

## 🌐 Live Demo
👉 **Try it now:** https://akisum.com

---

## 📦 Project Purpose

This repository contains the full interface, audio engine, UI logic, and game flow for Akisum.  
Designed for streamers, community games, events, and viral social challenges.
