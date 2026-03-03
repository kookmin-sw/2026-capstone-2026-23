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
    if (storagePercent >= 90)
      return { bg: 'bg-destructive', text: 'text-destructive' }
    if (storagePercent >= 70)
      return { bg: 'bg-[#f1c21b]', text: 'text-[#684e00]' }
    return { bg: 'bg-primary', text: 'text-primary' }
  }
  const storageColor = getStorageColor()

  return (
    <Sidebar>
      <SidebarHeader className="border-sidebar-border border-b p-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center">
            <span className="text-primary-foreground text-lg font-bold">L</span>
          </div>
          <span className="text-sidebar-foreground font-bold">Luminir</span>
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
        <div className="border-sidebar-border border-t p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="text-sidebar-foreground/60 h-4 w-4" />
                <span className="text-sidebar-foreground/80 text-sm font-medium">
                  스토리지
                </span>
              </div>
              <span className={`text-sm font-semibold ${storageColor.text}`}>
                {storagePercent.toFixed(0)}%
              </span>
            </div>
            <div className="bg-sidebar-accent h-2 w-full overflow-hidden">
              <div
                className={`h-full ${storageColor.bg} transition-all duration-300`}
                style={{ width: `${Math.min(storagePercent, 100)}%` }}
              />
            </div>
            <div className="text-sidebar-foreground/60 text-xs">
              {storageUsedGB.toFixed(1)} GB / {storageLimitGB} GB
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="border-sidebar-border border-t p-4">
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
