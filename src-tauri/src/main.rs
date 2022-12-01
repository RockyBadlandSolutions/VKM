#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri_plugin_store::PluginBuilder;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// on page load, call the greet command and log the resul

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .plugin(PluginBuilder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
