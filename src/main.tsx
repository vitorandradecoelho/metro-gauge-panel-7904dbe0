import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("🚀 Main.tsx - Iniciando aplicação");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("❌ Main.tsx - Elemento root não encontrado!");
  throw new Error("Root element not found");
}

console.log("✅ Main.tsx - Elemento root encontrado, criando app");
createRoot(rootElement).render(<App />);
console.log("✅ Main.tsx - App renderizada");
