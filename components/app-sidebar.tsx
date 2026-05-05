"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  CommandIcon,
  FilmIcon,
  BubblesIcon,
  NotebookIcon,
  RectangleGogglesIcon,
} from "lucide-react";
import {
  BubbleChatIcon,
  ChatAddIcon,
  ChatIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const data = {
  user: {
    name: "Cutie Korunka",
    email: "cutie@princeznovo.sk",
    avatar: "/avatars/padme.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Filmy",
      url: "/filmy",
      icon: (
        <FilmIcon
        />
      ),
    },
    {
      title: "Správy",
      url: "/spravy",
      icon: (
        <HugeiconsIcon icon={BubbleChatIcon}
        />
      ),
    },
    {
      title: "Denníček",
      url: "/",
      icon: (
        <NotebookIcon
        />
      ),
    },
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <RectangleGogglesIcon className="size-5!" />
                <span className="text-base font-semibold">SorošCorp</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
