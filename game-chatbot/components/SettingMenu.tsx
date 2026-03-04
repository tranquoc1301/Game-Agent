'use client'

import {Check, Languages, Monitor, Moon, Settings, Sun} from 'lucide-react'
import {useTheme} from 'next-themes'
import {useState} from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function SettingsMenu() {
    const {theme, setTheme} = useTheme()
    const [language, setLanguage] = useState('vi')

    const themeOptions = [
        {value: 'light', label: 'Light', icon: Sun},
        {value: 'dark', label: 'Dark', icon: Moon},
        {value: 'system', label: 'System', icon: Monitor},
    ]

    const languageOptions = [
        {value: 'vi', label: 'Tiếng Việt'},
        {value: 'en', label: 'English'},
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-accent/75 cursor-pointer transition-all duration-200"
                    aria-label="Settings"
                >
                    <Settings size={20}/>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                {/* Theme Section */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Theme
                </DropdownMenuLabel>
                <div className="flex items-center gap-1 px-2 py-1">
                    {themeOptions.map((option) => {
                        const Icon = option.icon
                        const isActive = theme === option.value

                        return (
                            <button
                                key={option.value}
                                onClick={() => setTheme(option.value)}
                                className={`
                                  flex-1 flex items-center justify-center gap-2 p-2 rounded-lg
                                  transition-all duration-200 hover:bg-accent
                                  cursor-pointer
                                  ${isActive ? 'bg-accent' : ''}
                                `}
                                title={option.label}
                            >
                                <Icon size={18} className={isActive ? 'text-primary' : ''}/>
                            </button>
                        )
                    })}
                </div>

                <DropdownMenuSeparator/>

                {/* Language Section */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Language
                </DropdownMenuLabel>
                {languageOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => setLanguage(option.value)}
                        className="cursor-pointer"
                    >
                        <Languages size={16} className="mr-2"/>
                        <span className="flex-1">{option.label}</span>
                        {language === option.value && (
                            <Check size={16} className="text-primary"/>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
