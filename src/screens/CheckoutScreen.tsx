import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

/**
 * Real React Native / RN-Web implementation of Figma node 1741:78002
 * ("6.0 — Extrastores Checkout"). This renders actual primitives, not an
 * exported screenshot. Tokens below come from the Figma frame spec.
 *
 * Layout strategy: the Figma frame is a fixed 390×848 device canvas. We render
 * it at its true intrinsic size and scale-to-fit the surrounding browser/device
 * viewport so the entire frame — all four payment rows, the selected Tasheel
 * row, the CTA, and the Safari bar — stays visible at any window height. This
 * mirrors how the Figma frame reads on the canvas and prevents the footer from
 * overlaying content on short browser heights.
 */

// Intrinsic Figma frame size for node 1741:78002 (390×848).
const FRAME_WIDTH = 390;
const FRAME_HEIGHT = 848;
// Breathing room so the scaled frame never touches the viewport edges.
const VIEWPORT_PADDING = 16;

const colors = {
  surface: '#ffffff',
  cell: '#f7f7f7',
  border: '#dfe5e5',
  ink: '#121212',
  inkSoft: '#1c1c1e',
  textPrimary: '#121212',
  textMuted: '#6b7280',
  radioIdle: '#c4cbcb',
  pageBackdrop: '#0d0d0f',
  batteryFill: '#34c759',
};

type Method = {
  key: string;
  title: string;
  subtitle?: string;
};

const methods: Method[] = [
  { key: 'card', title: 'Credit / Debit Card' },
  { key: 'apple', title: 'Apple Pay' },
  { key: 'cod', title: 'Cash on Delivery' },
  { key: 'tasheel', title: 'Tasheel BNPL', subtitle: 'Split into 3–12 monthly installments' },
];

function StatusBar() {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusTime}>9:41</Text>
      <View style={styles.statusIcons}>
        <View style={styles.signal}>
          {[6, 9, 12, 15].map((h) => (
            <View key={h} style={[styles.signalBar, { height: h }]} />
          ))}
        </View>
        <View style={styles.battery}>
          <View style={styles.batteryFill} />
          <View style={styles.batteryNub} />
        </View>
      </View>
    </View>
  );
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected ? <View style={styles.radioDot} /> : null}
    </View>
  );
}

function PaymentRow({
  method,
  selected,
  onSelect,
}: {
  method: Method;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={method.subtitle ? `${method.title}. ${method.subtitle}` : method.title}
      style={({ pressed }) => [
        styles.optionRow,
        selected && styles.optionRowSelected,
        pressed && styles.optionRowPressed,
      ]}
    >
      <Radio selected={selected} />
      <View style={styles.optionTextWrap}>
        <Text style={styles.optionTitle}>{method.title}</Text>
        {method.subtitle ? <Text style={styles.optionSubtitle}>{method.subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

function SafariBar() {
  return (
    <View style={styles.safariWrap}>
      <View style={styles.safariRow}>
        <View style={styles.safariCircle}>
          <View style={styles.chevron} />
        </View>
        <View style={styles.safariPill}>
          <View style={styles.pageGlyph} />
          <Text style={styles.safariUrl}>extrastores.com</Text>
          <View style={styles.refreshGlyph} />
        </View>
        <View style={styles.safariCircle}>
          <View style={styles.tabsGlyph} />
        </View>
      </View>
      <View style={styles.homeIndicator} />
    </View>
  );
}

export default function CheckoutScreen() {
  const [selected, setSelected] = useState('tasheel');
  const active = methods.find((m) => m.key === selected) ?? methods[3];
  const ctaLabel =
    active.key === 'tasheel' ? 'Proceed with Tasheel BNPL' : `Proceed with ${active.title}`;

  // Scale-to-fit: shrink the 390×848 frame to whichever axis is the tighter
  // constraint, never upscaling past 1× on large desktop windows.
  const { width, height } = useWindowDimensions();
  const available = {
    width: Math.max(width - VIEWPORT_PADDING * 2, 1),
    height: Math.max(height - VIEWPORT_PADDING * 2, 1),
  };
  const scale = Math.min(available.width / FRAME_WIDTH, available.height / FRAME_HEIGHT, 1);

  return (
    <View style={styles.page}>
      <View style={[styles.device, { transform: [{ scale }] }]}>
        <StatusBar />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.brand}>Extrastores</Text>
          <Text style={styles.brandSub}>Complete your purchase</Text>

          <View style={styles.productCard}>
            <View style={styles.thumb}>
              {/* Figma uses an emoji placeholder for the product thumbnail; preserved as-is. */}
              <Text style={styles.thumbGlyph}>📱</Text>
            </View>
            <View style={styles.productText}>
              <Text style={styles.productTitle}>iPhone 16 Pro Max</Text>
              <Text style={styles.productSub}>256GB — Natural Titanium</Text>
              <Text style={styles.productPrice}>SAR 6,553.85</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Payment Method</Text>

          <View style={styles.options}>
            {methods.map((method) => (
              <PaymentRow
                key={method.key}
                method={method}
                selected={selected === method.key}
                onSelect={() => setSelected(method.key)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={ctaLabel}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </Pressable>
          <SafariBar />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.pageBackdrop,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  device: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    backgroundColor: colors.surface,
    borderRadius: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 24 },
  },
  // Status bar
  statusBar: {
    height: 44,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTime: { fontSize: 15, fontWeight: '700', color: colors.ink },
  statusIcons: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  signal: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 15 },
  signalBar: { width: 3, borderRadius: 1, backgroundColor: colors.ink },
  battery: {
    width: 24,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.ink,
    padding: 1.5,
    justifyContent: 'center',
  },
  batteryFill: { flex: 1, borderRadius: 1.5, backgroundColor: colors.batteryFill },
  batteryNub: {
    position: 'absolute',
    right: -3,
    width: 2,
    height: 4,
    borderRadius: 1,
    backgroundColor: colors.ink,
  },
  // Body
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  brand: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3 },
  brandSub: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  productCard: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.cell,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbGlyph: { fontSize: 28 },
  productText: { flex: 1, minWidth: 0 },
  productTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  productSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  productPrice: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginTop: 6 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  options: { gap: 12 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionRowSelected: {
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: colors.cell,
  },
  optionRowPressed: { opacity: 0.7 },
  optionTextWrap: { flex: 1, minWidth: 0 },
  optionTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  optionSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.radioIdle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: colors.ink },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.ink },
  // Footer
  footer: { paddingHorizontal: 24, paddingTop: 8 },
  cta: {
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPressed: { backgroundColor: colors.inkSoft },
  ctaText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  // Safari chrome
  safariWrap: { paddingTop: 14, paddingBottom: 8 },
  safariRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  safariCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f3f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    width: 9,
    height: 9,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#3a3a3c',
    transform: [{ rotate: '45deg' }],
    marginLeft: 3,
  },
  safariPill: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f3f4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  pageGlyph: {
    width: 14,
    height: 12,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#8e8e93',
  },
  safariUrl: { fontSize: 15, color: '#1c1c1e', fontWeight: '500' },
  refreshGlyph: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#8e8e93',
    borderTopColor: 'transparent',
  },
  tabsGlyph: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#3a3a3c',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#121212',
    marginTop: 14,
  },
});
