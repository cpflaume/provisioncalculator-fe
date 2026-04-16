import type { ConfigureSettingsRequest, SubmitPurchasesRequest } from "@/api/types"

// ── Small Example (5 nodes, depth 3, 10 purchases) ──────────────────

export const smallTreeConfig: ConfigureSettingsRequest = {
  rates: [],
  tree: [
    { customerId: "Anna", parentCustomerId: null },
    { customerId: "Ben", parentCustomerId: "Anna" },
    { customerId: "Clara", parentCustomerId: "Ben" },
    { customerId: "David", parentCustomerId: "Clara" },
    { customerId: "Eva", parentCustomerId: "Ben" },
  ],
}

export const smallPurchases: SubmitPurchasesRequest = {
  purchases: [
    { buyerCustomerId: "Clara", amount: 300, purchasedAt: "2026-03-01T10:00:00" },
    { buyerCustomerId: "David", amount: 200, purchasedAt: "2026-03-02T14:30:00" },
    { buyerCustomerId: "Eva", amount: 300, purchasedAt: "2026-03-03T09:15:00" },
    { buyerCustomerId: "Ben", amount: 200, purchasedAt: "2026-03-04T16:45:00" },
    { buyerCustomerId: "Clara", amount: 400, purchasedAt: "2026-03-05T11:20:00" },
    { buyerCustomerId: "David", amount: 100, purchasedAt: "2026-03-06T08:00:00" },
    { buyerCustomerId: "Eva", amount: 600, purchasedAt: "2026-03-07T13:45:00" },
    { buyerCustomerId: "Ben", amount: 200, purchasedAt: "2026-03-08T15:30:00" },
    { buyerCustomerId: "Anna", amount: 200, purchasedAt: "2026-03-09T10:15:00" },
    { buyerCustomerId: "David", amount: 300, purchasedAt: "2026-03-10T12:00:00" },
  ],
}

// ── Large Example (500 nodes, depth 20, 1500 purchases) ─────────────

// Deterministic PRNG (mulberry32)
function createRng(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FIRST_NAMES = [
  "Anna", "Ben", "Clara", "David", "Eva", "Felix", "Greta", "Hans", "Ida", "Jan",
  "Katrin", "Leo", "Marie", "Nico", "Olivia", "Paul", "Rita", "Stefan", "Tina", "Udo",
  "Vera", "Walter", "Xenia", "Yusuf", "Zara", "Alexander", "Brigitte", "Christian", "Diana", "Emil",
  "Franziska", "Georg", "Hanna", "Igor", "Julia", "Karl", "Laura", "Max", "Nina", "Otto",
  "Petra", "Quentin", "Rosa", "Simon", "Theresa", "Ulrike", "Viktor", "Wilma", "Xaver", "Yvonne",
]

function generateName(index: number): string {
  const base = FIRST_NAMES[index % FIRST_NAMES.length]
  const cycle = Math.floor(index / FIRST_NAMES.length)
  return cycle === 0 ? base : `${base}${cycle + 1}`
}

function generateLargeTree(): ConfigureSettingsRequest {
  const rng = createRng(42)
  const nodeCount = 500
  const maxDepth = 20

  // Generate unique names
  const names = Array.from({ length: nodeCount }, (_, i) => generateName(i))

  const tree: { customerId: string; parentCustomerId: string | null }[] = []

  // Spine: chain of 21 nodes (depth 0 to depth 20) to guarantee max depth
  tree.push({ customerId: names[0], parentCustomerId: null })
  for (let i = 1; i <= maxDepth; i++) {
    tree.push({ customerId: names[i], parentCustomerId: names[i - 1] })
  }

  // Remaining nodes: attach to random existing node
  for (let i = maxDepth + 1; i < nodeCount; i++) {
    const parentIdx = Math.floor(rng() * tree.length)
    tree.push({ customerId: names[i], parentCustomerId: tree[parentIdx].customerId })
  }

  return { rates: [], tree }
}

function generateLargePurchases(treeConfig: ConfigureSettingsRequest): SubmitPurchasesRequest {
  const rng = createRng(123)
  const purchaseCount = 1500
  const customerIds = treeConfig.tree.map((n) => n.customerId)

  const purchases = Array.from({ length: purchaseCount }, () => {
    const buyerIdx = Math.floor(rng() * customerIds.length)
    // Amount between 100 and 10000, rounded to nearest 100
    const amount = Math.round((100 + rng() * 9900) / 100) * 100
    // Random date in 2026
    const month = 1 + Math.floor(rng() * 12)
    const day = 1 + Math.floor(rng() * 28)
    const hour = Math.floor(rng() * 24)
    const minute = Math.floor(rng() * 60)
    const mm = String(month).padStart(2, "0")
    const dd = String(day).padStart(2, "0")
    const hh = String(hour).padStart(2, "0")
    const min = String(minute).padStart(2, "0")

    return {
      buyerCustomerId: customerIds[buyerIdx],
      amount,
      purchasedAt: `2026-${mm}-${dd}T${hh}:${min}:00`,
    }
  })

  return { purchases }
}

export const largeTreeConfig = generateLargeTree()
export const largePurchases = generateLargePurchases(largeTreeConfig)
