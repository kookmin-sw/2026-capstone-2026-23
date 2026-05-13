import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  AlertTriangle,
  Settings,
  HardDrive,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ChevronsUpDown,
  Bot,
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
  useSidebar,
} from '@/shared/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { useUIStore } from '@/app/model/ui-store'
import { useSessionStore, useCurrentUser } from '@/entities/session'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/rag', icon: Bot, label: 'RAG' },
  { path: '/convert', icon: Upload, label: '변환' },
  { path: '/files', icon: FolderOpen, label: '파일관리' },
  { path: '/errors', icon: AlertTriangle, label: '에러 로그' },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { state, toggleSidebar } = useSidebar()
  const { isMockMode } = useUIStore()
  const clearSession = useSessionStore((s) => s.clearSession)
  const { data: user } = useCurrentUser()
  const isCollapsed = state === 'collapsed'

  const handleLogout = () => {
    queryClient.clear()
    clearSession()
    navigate({ to: '/login' })
  }

  // Storage data (mock or null)
  const storageUsedGB = isMockMode ? 847.3 : null
  const storageLimitGB = 1000
  const storagePercent = storageUsedGB
    ? (storageUsedGB / storageLimitGB) * 100
    : 0

  const getStorageColor = () => {
    if (storagePercent >= 90)
      return { bg: 'bg-destructive', text: 'text-destructive' }
    if (storagePercent >= 70)
      return { bg: 'bg-[#f1c21b]', text: 'text-[#684e00]' }
    return { bg: 'bg-primary', text: 'text-primary' }
  }
  const storageColor = getStorageColor()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-sidebar-border border-b p-3">
        {isCollapsed ? (
          <div className="flex justify-center">
            <button
              onClick={toggleSidebar}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent p-1"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center">
                <span className="text-primary-foreground text-lg font-bold">
                  L
                </span>
              </div>
              <span className="text-sidebar-foreground truncate font-bold">
                Luminir
              </span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0 p-1"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        )}
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
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
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

      <SidebarFooter className="!gap-0 !p-0">
        {/* Storage — only when data available */}
        {storageUsedGB !== null && (
          <div className="border-sidebar-border border-t p-4 group-data-[collapsible=icon]:hidden">
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
        )}

        {/* User dropdown */}
        <SidebarMenu className="border-sidebar-border border-t p-2">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={user?.name ?? '사용자'}
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <span className="bg-sidebar-accent inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-semibold">
                    {user?.name?.charAt(0) ?? '?'}
                  </span>
                  <span className="truncate text-sm">
                    {user?.name ?? '...'}
                  </span>
                  <ChevronsUpDown className="text-sidebar-foreground/50 ml-auto h-4 w-4 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
              >
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    설정
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
