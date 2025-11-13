import { Suspense, lazy, ComponentType } from 'react'
import { motion } from 'framer-motion'

// Lazy load tab components
const SpiritlingProfile = lazy(() => import('./SpiritlingProfile'))
const ActionPanel = lazy(() => import('./ActionPanel'))
const SpiritlingList = lazy(() => import('./SpiritlingList'))
const ItemShop = lazy(() => import('./ItemShop'))
const Inventory = lazy(() => import('./Inventory'))
const ActionLog = lazy(() => import('./ActionLog'))
const CompetitionList = lazy(() => import('./CompetitionList'))
const FriendList = lazy(() => import('./FriendList'))
const VillageView = lazy(() => import('./VillageView'))

// Loading fallback for tab content
function TabLoadingFallback() {
  return (
    <div className="card flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-4xl mb-2"
      >
        🦄
      </motion.div>
      <p className="text-sm text-gray-500">로딩 중...</p>
    </div>
  )
}

interface LazyTabContentProps {
  component: ComponentType<any>
  props?: Record<string, any>
}

export function LazyTabContent({ component: Component, props = {} }: LazyTabContentProps) {
  return (
    <Suspense fallback={<TabLoadingFallback />}>
      <Component {...props} />
    </Suspense>
  )
}

// Export lazy components
export {
  SpiritlingProfile,
  ActionPanel,
  SpiritlingList,
  ItemShop,
  Inventory,
  ActionLog,
  CompetitionList,
  FriendList,
  VillageView,
  TabLoadingFallback,
}

