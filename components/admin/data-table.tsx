"use client"

import { useState, useMemo, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  CheckSquare,
  Square,
  Download,
  SlidersHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (item: T, index: number) => ReactNode
  className?: string
  hideOnMobile?: boolean
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  onSelectionChange?: (selected: string[]) => void
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  searchQuery?: string
  pageSize?: number
  currentPage?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  loading?: boolean
  emptyMessage?: string
  emptyIcon?: ReactNode
  actions?: (item: T) => ReactNode
  selectable?: boolean
  exportable?: boolean
  onExport?: () => void
  sortColumn?: string
  sortDirection?: "asc" | "desc"
  onSort?: (column: string, direction: "asc" | "desc") => void
  className?: string
  filters?: ReactNode
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  onSelectionChange,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  searchQuery: externalSearchQuery,
  pageSize: externalPageSize,
  currentPage: externalCurrentPage,
  totalItems: externalTotalItems,
  onPageChange,
  loading = false,
  emptyMessage = "No data found",
  emptyIcon,
  actions,
  selectable = false,
  exportable = false,
  onExport,
  sortColumn: externalSortColumn,
  sortDirection: externalSortDirection,
  onSort,
  className,
  filters,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState("")
  const [internalPage, setInternalPage] = useState(1)
  const [pageSize, setPageSize] = useState(externalPageSize || 10)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [internalSortCol, setInternalSortCol] = useState<string | undefined>(
    externalSortColumn,
  )
  const [internalSortDir, setInternalSortDir] = useState<"asc" | "desc">(
    externalSortDirection || "asc",
  )

  const isControlled = externalSearchQuery !== undefined
  const searchQuery = isControlled ? externalSearchQuery : internalSearch
  const isPageControlled = externalCurrentPage !== undefined
  const currentPage = isPageControlled ? externalCurrentPage : internalPage

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query)
    } else {
      setInternalSearch(query)
    }
    if (!isPageControlled) setInternalPage(1)
  }

  const filteredData = useMemo(() => {
    if (isControlled || onSearch) return data
    if (!internalSearch.trim()) return data
    const q = internalSearch.toLowerCase()
    return data.filter((item) =>
      columns.some((col) => {
        const val = item[col.key]
        return val != null && String(val).toLowerCase().includes(q)
      }),
    )
  }, [data, internalSearch, columns, isControlled, onSearch])

  const sortedData = useMemo(() => {
    const sortCol = isControlled ? externalSortColumn : internalSortCol
    const sortDir = isControlled ? externalSortDirection : internalSortDir
    if (!sortCol) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortCol]
      const bVal = b[sortCol]
      if (aVal == null || bVal == null) return 0
      const cmp =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [
    filteredData,
    isControlled,
    externalSortColumn,
    externalSortDirection,
    internalSortCol,
    internalSortDir,
  ])

  const totalFiltered = isControlled
    ? externalTotalItems ?? sortedData.length
    : sortedData.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))

  const paginatedData = useMemo(() => {
    if (isPageControlled || onPageChange) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, isPageControlled, onPageChange])

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages))
    if (onPageChange) {
      onPageChange(p)
    } else {
      setInternalPage(p)
    }
  }

  const handleSort = (column: string) => {
    if (isControlled && onSort) {
      const newDir =
        externalSortColumn === column && externalSortDirection === "asc"
          ? "desc"
          : "asc"
      onSort(column, newDir)
    } else {
      setInternalSortCol(column)
      setInternalSortDir((prev) =>
        internalSortCol === column && prev === "asc" ? "desc" : "asc",
      )
    }
  }

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
      onSelectionChange?.(next)
      return next
    })
  }

  const toggleAll = () => {
    const allIds = paginatedData.map((item) => keyExtractor(item))
    const next = selectedRows.length === allIds.length ? [] : allIds
    setSelectedRows(next)
    onSelectionChange?.(next)
  }

  const isAllSelected =
    paginatedData.length > 0 && selectedRows.length === paginatedData.length

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {(searchable || exportable || filters) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            {searchable && (
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            )}
            {filters && <div className="flex items-center gap-2">{filters}</div>}
          </div>
          <div className="flex items-center gap-2">
            {exportable && (
              <button
                onClick={onExport}
                className="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary hover:bg-bg-secondary transition-all"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-warm-white dark:bg-bg-secondary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-secondary/50">
                {selectable && (
                  <th className="w-12 px-4 py-3.5 text-left">
                    <button
                      onClick={toggleAll}
                      className="text-text-muted hover:text-text-primary transition-colors"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted",
                      col.sortable && "cursor-pointer select-none hover:text-text-primary",
                      col.hideOnMobile && "hidden md:table-cell",
                      col.className,
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && (
                        <span className="inline-flex flex-col -space-y-1.5">
                          <ChevronUp
                            className={cn(
                              "h-3 w-3",
                              isControlled
                                ? externalSortColumn === col.key &&
                                    externalSortDirection === "asc"
                                  ? "text-secondary"
                                  : "text-text-muted/40"
                                : internalSortCol === col.key &&
                                    internalSortDir === "asc"
                                  ? "text-secondary"
                                  : "text-text-muted/40",
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              "h-3 w-3",
                              isControlled
                                ? externalSortColumn === col.key &&
                                    externalSortDirection === "desc"
                                  ? "text-secondary"
                                  : "text-text-muted/40"
                                : internalSortCol === col.key &&
                                    internalSortDir === "desc"
                                  ? "text-secondary"
                                  : "text-text-muted/40",
                            )}
                          />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="w-16 px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <AnimatePresence mode="wait">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skeleton-${i}`}>
                      {selectable && <td className="w-12 px-4" />}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            "px-4 py-3",
                            col.hideOnMobile && "hidden md:table-cell",
                          )}
                        >
                          <div className="h-4 shimmer-skeleton rounded w-3/4" />
                        </td>
                      ))}
                      {actions && <td className="w-16 px-4" />}
                    </tr>
                  ))
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                      }
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                      >
                        {emptyIcon || (
                          <Search className="h-12 w-12 text-text-muted/30 mb-4" />
                        )}
                        <p className="text-text-muted text-sm font-medium">
                          {emptyMessage}
                        </p>
                      </motion.div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, idx) => {
                    const id = keyExtractor(item)
                    const isSelected = selectedRows.includes(id)
                    return (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "transition-colors",
                          onRowClick && "cursor-pointer hover:bg-bg-secondary/50",
                          isSelected && "bg-secondary/5",
                        )}
                        onClick={() => onRowClick?.(item)}
                      >
                        {selectable && (
                          <td className="w-12 px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleRow(id)
                              }}
                              className="text-text-muted hover:text-text-primary transition-colors"
                            >
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4 text-secondary" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        )}
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className={cn(
                              "px-4 py-3 text-sm text-text-primary",
                              col.hideOnMobile && "hidden md:table-cell",
                              col.className,
                            )}
                          >
                            {col.render
                              ? col.render(item, idx)
                              : (item[col.key] as ReactNode) ?? "-"}
                          </td>
                        ))}
                        {actions && (
                          <td
                            className="px-4 py-3 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {actions(item)}
                          </td>
                        )}
                      </motion.tr>
                    )
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-muted">
            Showing{" "}
            <span className="font-medium text-text-primary">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-text-primary">
              {Math.min(currentPage * pageSize, totalFiltered)}
            </span>{" "}
            of <span className="font-medium text-text-primary">{totalFiltered}</span>{" "}
            results
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(
                1,
                Math.min(currentPage - 2, totalPages - 4),
              )
              const page = start + i
              if (page > totalPages) return null
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={cn(
                    "min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-medium transition-all",
                    page === currentPage
                      ? "bg-secondary text-dark-slate shadow-sm"
                      : "text-text-muted hover:text-text-primary hover:bg-bg-secondary",
                  )}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
