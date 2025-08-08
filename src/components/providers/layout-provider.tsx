"use client"

import React, { createContext, useContext, useState } from 'react'

interface LayoutContextType {
  title: string
  setTitle: (title: string) => void
  subtitle: string
  setSubtitle: (subtitle: string) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  return (
    <LayoutContext.Provider value={{ title, setTitle, subtitle, setSubtitle }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
} 