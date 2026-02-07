"use client";

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Search as SearchIcon,
    Dashboard,
    Task,
    Analytics,
    DocumentAdd,
    Settings as SettingsIcon,
    User as UserIcon,
    ChevronDown as ChevronDownIcon,
    Filter,
    InProgress,
    CheckmarkOutline,
    Security,
    ChartBar,
    FolderOpen
} from "@carbon/icons-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

// Softer spring animation curve
const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

/* ----------------------------- Brand / Logos ----------------------------- */

function InterfacesLogoSquare() {
    return (
        <div className="aspect-square grow min-h-px min-w-px overflow-hidden relative shrink-0 flex items-center justify-center">
            <img
                src="/logo-grupoom.png"
                alt="Hub de Automação"
                className="h-6 w-auto object-contain brightness-0 invert"
            />
        </div>
    );
}

function BrandBadge() {
    return (
        <div className="relative shrink-0 w-full mb-4">
            <div className="flex items-center p-1 w-full gap-2">
                <div className="h-10 w-8 flex items-center justify-center">
                    <InterfacesLogoSquare />
                </div>
                <div className="flex flex-col">
                    <div className="font-[sans-serif] text-[14px] font-bold text-neutral-50 tracking-tight">
                        HUB DE AUTOMAÇÃO
                    </div>
                    <div className="font-[sans-serif] text-[10px] text-neutral-400 uppercase tracking-widest">
                        Centro de Comando
                    </div>
                </div>
            </div>
        </div>
    );
}

/* --------------------------------- Avatar -------------------------------- */

function AvatarDisplay() {
    const { userAvatar } = useUser();
    return (
        <div className="w-full h-full flex items-center justify-center scale-125">
            {userAvatar.svg}
        </div>
    );
}

/* ------------------------------ Search Input ----------------------------- */

function SearchContainer({ isCollapsed = false }: { isCollapsed?: boolean }) {
    const [searchValue, setSearchValue] = useState("");

    return (
        <div
            className={`relative shrink-0 transition-all duration-500 mb-4 ${isCollapsed ? "w-full flex justify-center" : "w-full"
                }`}
            style={{ transitionTimingFunction: softSpringEasing }}
        >
            <div
                className={`bg-white/5 h-10 relative rounded-lg flex items-center transition-all duration-500 border border-white/10 ${isCollapsed ? "w-10 min-w-10 justify-center" : "w-full"
                    }`}
                style={{ transitionTimingFunction: softSpringEasing }}
            >
                <div
                    className={`flex items-center justify-center shrink-0 transition-all duration-500 ${isCollapsed ? "p-1" : "px-1"
                        }`}
                    style={{ transitionTimingFunction: softSpringEasing }}
                >
                    <div className="size-8 flex items-center justify-center">
                        <SearchIcon size={16} className="text-neutral-400" />
                    </div>
                </div>

                <div
                    className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${isCollapsed ? "opacity-0 w-0" : "opacity-100"
                        }`}
                    style={{ transitionTimingFunction: softSpringEasing }}
                >
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-[14px] text-neutral-50 placeholder:text-neutral-500 px-2 h-full focus:ring-0"
                        tabIndex={isCollapsed ? -1 : 0}
                    />
                </div>
            </div>
        </div>
    );
}

/* --------------------------- Types / Content Map -------------------------- */

interface MenuItemT {
    icon?: React.ReactNode;
    label: string;
    hasDropdown?: boolean;
    isActive?: boolean;
    children?: MenuItemT[];
    path?: string; // Added path property for navigation
}
interface MenuSectionT {
    title: string;
    items: MenuItemT[];
}
interface SidebarContent {
    title: string;
    sections: MenuSectionT[];
}

// ADAPTED CONTENT MAP FOR GROUPO OM APP
function getSidebarContent(activeSection: string): SidebarContent {
    const contentMap: Record<string, SidebarContent> = {
        dashboard: {
            title: "Painel Geral",
            sections: [
                {
                    title: "Visão Geral",
                    items: [
                        { icon: <Dashboard size={16} className="text-neutral-50" />, label: "Dashboard Principal", isActive: true, path: "/" },
                        { icon: <Analytics size={16} className="text-neutral-50" />, label: "Status do Sistema", path: "#status" },
                    ],
                },
                {
                    title: "Métricas",
                    items: [
                        { icon: <ChartBar size={16} className="text-neutral-50" />, label: "Desempenho", path: "/reports" },
                    ]
                }
            ],
        },

        approvals: {
            title: "Aprovações",
            sections: [
                {
                    title: "Ações Rápidas",
                    items: [
                        { icon: <Filter size={16} className="text-neutral-50" />, label: "Filtrar Pendentes", path: "/approvals?filter=pending" },
                    ],
                },
                {
                    title: "Minhas Listas",
                    items: [
                        {
                            icon: <InProgress size={16} className="text-neutral-50" />,
                            label: "Em Andamento",
                            hasDropdown: true,
                            children: [
                                { icon: <Task size={14} className="text-neutral-300" />, label: "Mídia OOH", path: "/approvals/ooh" },
                                { icon: <Task size={14} className="text-neutral-300" />, label: "Digital", path: "/approvals/digital" },
                            ],
                        },
                        {
                            icon: <CheckmarkOutline size={16} className="text-neutral-50" />,
                            label: "Finalizados",
                            path: "/approvals/history"
                        },
                    ],
                },
            ],
        },

        reports: {
            title: "Relatórios",
            sections: [
                {
                    title: "Financeiro",
                    items: [
                        { icon: <DocumentAdd size={16} className="text-neutral-50" />, label: "Faturamento", path: "/reports/billing" },
                    ]
                },
                {
                    title: "Performance",
                    items: [
                        { icon: <Analytics size={16} className="text-neutral-50" />, label: "Mídia Performada", path: "/reports/perf" },
                    ]
                }
            ]
        },

        settings: {
            title: "Configurações",
            sections: [
                {
                    title: "Conta",
                    items: [
                        { icon: <UserIcon size={16} className="text-neutral-50" />, label: "Meu Perfil", path: "/settings/profile" },
                        { icon: <Security size={16} className="text-neutral-50" />, label: "Segurança", path: "/settings/security" },
                    ],
                },
                {
                    title: "Workspace",
                    items: [
                        {
                            icon: <SettingsIcon size={16} className="text-neutral-50" />,
                            label: "Preferências",
                            path: "/settings"
                        },
                    ],
                },
            ],
        },
    };

    // Fallback map if section is not found (although we control keys)
    const defaultContent: SidebarContent = {
        title: "Menu",
        sections: []
    }

    return contentMap[activeSection] || defaultContent;
}

/* ---------------------------- Left Icon Nav Rail -------------------------- */

function IconNavButton({
    children,
    isActive = false,
    onClick,
    tooltip
}: {
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    tooltip?: string;
}) {
    return (
        <button
            type="button"
            className={`flex items-center justify-center rounded-lg size-10 min-w-10 transition-colors duration-500 relative group
        ${isActive ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "hover:bg-white/5 text-neutral-400 hover:text-white"}`}
            style={{ transitionTimingFunction: softSpringEasing }}
            onClick={onClick}
            title={tooltip}
        >
            {children}
            {isActive && (
                <div className="absolute inset-0 rounded-lg ring-1 ring-white/20 pointer-events-none" />
            )}
        </button>
    );
}

function IconNavigation({
    activeSection,
    onSectionChange,
}: {
    activeSection: string;
    onSectionChange: (section: string) => void;
}) {
    const navItems = [
        { id: "dashboard", icon: <Dashboard size={20} />, label: "Painel" },
        { id: "approvals", icon: <ClipboardCheckIcon />, label: "Aprovações" }, // Custom Icon wrapper below
        { id: "reports", icon: <ChartBar size={20} />, label: "Relatórios" },
        { id: "files", icon: <FolderOpen size={20} />, label: "Arquivos" },
    ];

    return (
        <aside className="bg-black/40 backdrop-blur-xl flex flex-col gap-3 items-center p-3 w-16 h-full border-r border-white/10 z-20">
            {/* Logo */}
            <div className="mb-4 mt-2 size-10 flex items-center justify-center">
                <Link to="/">
                    <InterfacesLogoSquare />
                </Link>
            </div>

            {/* Navigation Icons */}
            <div className="flex flex-col gap-3 w-full items-center">
                {navItems.map((item) => (
                    <IconNavButton
                        key={item.id}
                        isActive={activeSection === item.id}
                        onClick={() => onSectionChange(item.id)}
                        tooltip={item.label}
                    >
                        {item.icon}
                    </IconNavButton>
                ))}
            </div>

            <div className="flex-1" />

            {/* Bottom section */}
            <div className="flex flex-col gap-3 w-full items-center mb-2">
                <IconNavButton isActive={activeSection === "settings"} onClick={() => onSectionChange("settings")} tooltip="Configurações">
                    <SettingsIcon size={20} />
                </IconNavButton>
                <div className="size-8 cursor-pointer hover:ring-2 ring-white/20 rounded-full transition-all flex items-center justify-center overflow-hidden bg-black border border-white/10">
                    <AvatarDisplay />
                </div>
            </div>
        </aside>
    );
}

// Custom Icon helper
function ClipboardCheckIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 21.414L9 16.413 10.413 15 14 18.586 21.585 11 23 12.415 14 21.414z" />
            <path d="M16,2A5.006,5.006,0,0,0,11,7H5a2.006,2.006,0,0,0-2,2V26a2.006,2.006,0,0,0,2,2H27a2.006,2.006,0,0,0,2-2V9a2.006,2.006,0,0,0-2-2H21A5.006,5.006,0,0,0,16,2Zm0,2a3,3,0,0,1,3,3H13A3,3,0,0,1,16,4ZM5,9H11V7h2V9h6V7h2V9h6V26H5Z" />
        </svg>
    )
}

/* ------------------------------ Right Sidebar ----------------------------- */

function SectionTitle({
    title,
    onToggleCollapse,
    isCollapsed,
}: {
    title: string;
    onToggleCollapse: () => void;
    isCollapsed: boolean;
}) {
    if (isCollapsed) {
        return (
            <div className="w-full flex justify-center transition-all duration-500 mb-4" style={{ transitionTimingFunction: softSpringEasing }}>
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="flex items-center justify-center rounded-lg size-10 min-w-10 transition-all duration-500 hover:bg-white/10 text-neutral-400 hover:text-neutral-300"
                    style={{ transitionTimingFunction: softSpringEasing }}
                    aria-label="Expand sidebar"
                >
                    <span className="inline-block rotate-180">
                        <ChevronDownIcon size={16} />
                    </span>
                </button>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden transition-all duration-500 mb-4" style={{ transitionTimingFunction: softSpringEasing }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center h-10">
                    <div className="px-1 py-1">
                        {/* Using a nice gradient text for title */}
                        <div className="text-[18px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 leading-[27px] tracking-tight">
                            {title}
                        </div>
                    </div>
                </div>
                <div className="pr-1">
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="flex items-center justify-center rounded-lg size-8 min-w-8 transition-all duration-500 hover:bg-white/10 text-neutral-400 hover:text-white"
                        style={{ transitionTimingFunction: softSpringEasing }}
                        aria-label="Collapse sidebar"
                    >
                        <ChevronDownIcon size={16} className="-rotate-90" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailSidebar({ activeSection }: { activeSection: string }) {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebar_collapsed");
        return saved === "true";
    });
    const content = getSidebarContent(activeSection);
    const navigate = useNavigate();

    const toggleExpanded = (itemKey: string) => {
        setExpandedItems((prev) => {
            const next = new Set(prev);
            if (next.has(itemKey)) next.delete(itemKey);
            else next.add(itemKey);
            return next;
        });
    };

    const toggleCollapse = () => {
        setIsCollapsed((s) => {
            const newState = !s;
            localStorage.setItem("sidebar_collapsed", String(newState));
            return newState;
        });
    };

    return (
        <aside
            className={`bg-black/30 backdrop-blur-md flex flex-col gap-0 items-start p-4 border-r border-white/5 transition-all duration-500 h-full ${isCollapsed ? "w-0 min-w-0 !px-0 overflow-hidden" : "w-64"
                }`}
            style={{ transitionTimingFunction: softSpringEasing }}
        >
            {!isCollapsed && <BrandBadge />}

            <SectionTitle title={content.title} onToggleCollapse={toggleCollapse} isCollapsed={isCollapsed} />
            <SearchContainer isCollapsed={isCollapsed} />

            <div
                className={`flex flex-col w-full overflow-y-auto transition-all duration-500 custom-scrollbar ${isCollapsed ? "gap-2 items-center" : "gap-4 items-start"
                    }`}
                style={{ transitionTimingFunction: softSpringEasing }}
            >
                {content.sections.map((section, index) => (
                    <MenuSection
                        key={`${activeSection}-${index}`}
                        section={section}
                        expandedItems={expandedItems}
                        onToggleExpanded={toggleExpanded}
                        isCollapsed={isCollapsed}
                        onItemClick={(item) => {
                            if (item.path) navigate(item.path);
                        }}
                    />
                ))}
            </div>

        </aside>
    );
}

/* ------------------------------ Menu Elements ---------------------------- */

function MenuItem({
    item,
    isExpanded,
    onToggle,
    onItemClick,
    isCollapsed,
}: {
    item: MenuItemT;
    isExpanded?: boolean;
    onToggle?: () => void;
    onItemClick?: () => void;
    isCollapsed?: boolean;
}) {
    const location = useLocation();
    const isPathActive = item.path ? location.pathname === item.path : false;

    const handleClick = () => {
        if (item.hasDropdown && onToggle) onToggle();
        else onItemClick?.();
    };

    return (
        <div
            className={`relative shrink-0 transition-all duration-500 ${isCollapsed ? "w-full flex justify-center" : "w-full"
                }`}
            style={{ transitionTimingFunction: softSpringEasing }}
        >
            {/* Tooltip logic for collapsed state could go here */}
            <div
                className={`rounded-lg cursor-pointer transition-all duration-300 flex items-center relative group ${isPathActive ? "bg-vibrant-blue/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.1)]" : "hover:bg-white/5 text-neutral-400 hover:text-white"
                    } ${isCollapsed ? "w-10 min-w-10 h-10 justify-center p-0" : "w-full h-9 px-3 py-2"}`}
                style={{ transitionTimingFunction: softSpringEasing }}
                onClick={handleClick}
                title={isCollapsed ? item.label : undefined}
            >
                <div className={`flex items-center justify-center shrink-0 ${isPathActive ? "text-vibrant-blue" : ""}`}>{item.icon}</div>

                <div
                    className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-3"
                        }`}
                    style={{ transitionTimingFunction: softSpringEasing }}
                >
                    <div className={cn("text-[13px] leading-[20px] truncate", isPathActive ? "font-semibold" : "font-normal")}>
                        {item.label}
                    </div>
                </div>

                {item.hasDropdown && !isCollapsed && (
                    <div
                        className={`flex items-center justify-center shrink-0 transition-opacity duration-500 ml-2`}
                        style={{ transitionTimingFunction: softSpringEasing }}
                    >
                        <ChevronDownIcon
                            size={14}
                            className="text-neutral-500 transition-transform duration-500 group-hover:text-white"
                            style={{
                                transitionTimingFunction: softSpringEasing,
                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                        />
                    </div>
                )}

                {/* Pips for collapsed state active indication */}
                {isCollapsed && isPathActive && (
                    <div className="absolute right-1 top-1 w-1.5 h-1.5 bg-vibrant-blue rounded-full" />
                )}
            </div>
        </div>
    );
}

function SubMenuItem({ item, onItemClick }: { item: MenuItemT; onItemClick?: (item: MenuItemT) => void }) {
    const location = useLocation();
    const isPathActive = item.path ? location.pathname === item.path : false;

    return (
        <div className="w-full pl-9 pr-1 py-[1px]">
            <div
                className={cn(
                    "h-8 w-full rounded-md cursor-pointer transition-colors flex items-center px-3 py-1",
                    isPathActive ? "bg-white/10 text-white" : "hover:bg-white/5 text-neutral-400 hover:text-white"
                )}
                onClick={() => onItemClick?.(item)}
            >
                <div className="flex-1 min-w-0">
                    <div className="text-[13px] leading-[18px] truncate">
                        {item.label}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MenuSection({
    section,
    expandedItems,
    onToggleExpanded,
    isCollapsed,
    onItemClick
}: {
    section: MenuSectionT;
    expandedItems: Set<string>;
    onToggleExpanded: (itemKey: string) => void;
    isCollapsed?: boolean;
    onItemClick: (item: MenuItemT) => void;
}) {
    return (
        <div className="flex flex-col w-full">
            <div
                className={`relative shrink-0 w-full transition-all duration-500 overflow-hidden ${isCollapsed ? "h-0 opacity-0" : "h-8 opacity-100"
                    }`}
                style={{ transitionTimingFunction: softSpringEasing }}
            >
                <div className="flex items-center h-8 px-3">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
                        {section.title}
                    </div>
                </div>
            </div>

            {section.items.map((item, index) => {
                const itemKey = `${section.title}-${index}`;
                const isExpanded = expandedItems.has(itemKey);
                return (
                    <div key={itemKey} className="w-full flex flex-col mb-0.5">
                        <MenuItem
                            item={item}
                            isExpanded={isExpanded}
                            onToggle={() => onToggleExpanded(itemKey)}
                            onItemClick={() => onItemClick(item)}
                            isCollapsed={isCollapsed}
                        />
                        {isExpanded && item.children && !isCollapsed && (
                            <div className="flex flex-col gap-0.5 mb-1 relative before:absolute before:left-[19px] before:top-0 before:bottom-0 before:w-px before:bg-white/10">
                                {item.children.map((child, childIndex) => (
                                    <SubMenuItem
                                        key={`${itemKey}-${childIndex}`}
                                        item={child}
                                        onItemClick={onItemClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* --------------------------------- Layout -------------------------------- */

export function Sidebar({ className }: { className?: string }) {
    const [activeSection, setActiveSection] = useState("dashboard");
    const navigate = useNavigate();

    // Sync active section with route logic could be added here if bidirectional sync is needed.
    // For now, clicking icon switches specific sidebar view.

    return (
        <div className={cn("flex flex-row h-full", className)}>
            <IconNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
            <DetailSidebar activeSection={activeSection} />
        </div>
    );
}
