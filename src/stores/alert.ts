import { defineStore } from 'pinia';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface Alert {
  id: string;
  message: string;
  type: AlertType;
  count: number;       // <= counter untuk duplikat
}

export const useAlertStore = defineStore({
  id: 'alert',
  state: () => ({
    alerts: [] as Alert[]
  }),
  actions: {
    showAlert(message: string, type: AlertType = 'error') {
      if (!message) return;
      // Cari alert yang sama
      const existing = this.alerts.find(a => a.message === message && a.type === type);
      if (existing) {
        existing.count += 1;
        // reset timer untuk hapus agar user punya waktu baca
        clearTimeout((existing as any)._timeoutId);
        (existing as any)._timeoutId = setTimeout(() => {
          this.alerts = this.alerts.filter(a => a.id !== existing.id);
        }, 3000);
      } else {
        const id = Date.now().toString() + Math.random().toString(36).slice(2);
        const alert: Alert = { id, message, type, count: 1 };
        this.alerts.push(alert);
        // simpan timeoutId supaya bisa di‐clear nanti
        (alert as any)._timeoutId = setTimeout(() => {
          this.alerts = this.alerts.filter(a => a.id !== id);
        }, 3000);
      }
    }
  }
});