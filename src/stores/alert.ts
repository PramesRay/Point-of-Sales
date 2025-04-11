import { defineStore } from 'pinia';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface Alert {
  message: string;
  type: AlertType;
}

export const useAlertStore = defineStore({
  id: 'alert',
  state: () => ({
    alerts: [] as Alert[]
  }),
  actions: {
    showAlert(message: string, type: AlertType = 'error') {
      const alert: Alert = { message, type };
      this.alerts.push(alert);

      // Hapus notifikasi setelah 3 detik
      setTimeout(() => {
        const index = this.alerts.indexOf(alert);
        if (index !== -1) this.alerts.splice(index, 1);
      }, 3000);
    }
  }
});
