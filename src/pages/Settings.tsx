import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Bell, Database, Shield } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage system settings and configurations
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Email Notifications</Label>
              <Switch id="email-notif" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notif">SMS Alerts</Label>
              <Switch id="sms-notif" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notif">Push Notifications</Label>
              <Switch id="push-notif" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Database Configuration</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="db-url">MongoDB Connection URL</Label>
              <Input
                id="db-url"
                type="text"
                defaultValue="mongodb://localhost:27017/ssimp"
                disabled
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup">Auto Backup</Label>
              <Switch id="auto-backup" defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <Switch id="two-factor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                defaultValue="30"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">System</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="refresh-rate">Data Refresh Rate (seconds)</Label>
              <Input
                id="refresh-rate"
                type="number"
                defaultValue="5"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button>Save Changes</Button>
              <Button variant="outline">Reset to Defaults</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
