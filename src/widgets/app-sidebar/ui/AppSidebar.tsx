import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  AlertTriangle,
  Settings,
  HardDrive,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/convert', icon: Upload, label: '변환' },
  { path: '/files', icon: FolderOpen, label: '파일관리' },
  { path: '/errors', icon: AlertTriangle, label: '에러 로그' },
]

export function AppSidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // Mock storage data
  const storageUsedGB = 847.3
  const storageLimitGB = 1000
  const storagePercent = (storageUsedGB / storageLimitGB) * 100

  const getStorageColor = () => {
    if (storagePercent >= 90) return { bg: 'bg-destructive', text: 'text-destructive' }
    if (storagePercent >= 70) return { bg: 'bg-[#f1c21b]', text: 'text-[#684e00]' }
    return { bg: 'bg-primary', text: 'text-primary' }
  }
  const storageColor = getStorageColor()

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">L</span>
          </div>
          <span className="font-bold text-sidebar-foreground">Luminir</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPath === item.path
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path}>
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Storage */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-sidebar-foreground/60" />
                <span className="text-sm font-medium text-sidebar-foreground/80">스토리지</span>
              </div>
              <span className={`text-sm font-semibold ${storageColor.text}`}>
                {storagePercent.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-sidebar-accent overflow-hidden">
              <div
                className={`h-full ${storageColor.bg} transition-all duration-300`}
                style={{ width: `${Math.min(storagePercent, 100)}%` }}
              />
            </div>
            <div className="text-xs text-sidebar-foreground/60">
              {storageUsedGB.toFixed(1)} GB / {storageLimitGB} GB
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={currentPath === '/settings'}>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                  <span>설정</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
