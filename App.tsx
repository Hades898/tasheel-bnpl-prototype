import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

type RouteKey = 'checkout' | 'appHome' | 'detail' | 'insights' | 'purchases' | 'dues';
type Merchant = 'extra' | 'jarir' | 'noon';

const green = '#003f1f';
const neon = '#39ef14';
const canvas = '#f7f8f8';
const text = '#111827';
const muted = '#6b7280';
const border = '#e5e7eb';

const routeFromPath = (path: string): RouteKey => {
  if (path.includes('/checkout/app-home') || path.includes('/checkout/home')) return 'appHome';
  if (path.includes('/checkout/detail') || path.includes('/checkout/details')) return 'detail';
  if (path.includes('/checkout/insights')) return 'insights';
  if (path.includes('/checkout/purchases')) return 'purchases';
  if (path.includes('/checkout/dues')) return 'dues';
  return 'checkout';
};

function currentPath() {
  if (typeof window === 'undefined') return '/checkout';
  return window.location.pathname;
}

const githubPagesBase = '/tasheel-bnpl-prototype';

function withDeployBase(path: string) {
  if (typeof window === 'undefined') return path;
  const currentPath = window.location.pathname;
  if (currentPath === githubPagesBase || currentPath.startsWith(`${githubPagesBase}/`)) {
    return `${githubPagesBase}${path}`;
  }
  return path;
}

function pushPath(path: string) {
  if (typeof window !== 'undefined') window.history.pushState({}, '', withDeployBase(path));
}

function Riyal({ size = 14, color = text }: { size?: number; color?: string }) {
  return <Text style={{ fontSize: size, fontWeight: '900', color, marginRight: 2 }}>﷼</Text>;
}

function Money({ amount, decimals, size = 16, color = text }: { amount: string; decimals?: string; size?: number; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Riyal size={Math.max(12, size - 3)} color={color} />
      <Text style={{ fontSize: size, fontWeight: '900', color, letterSpacing: -0.4 }}>{amount}</Text>
      {decimals ? <Text style={{ fontSize: Math.max(11, size - 6), fontWeight: '800', color }}>{decimals}</Text> : null}
    </View>
  );
}

function TasheelMark({ size = 30 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', gap: size * 0.12, transform: [{ skewY: '-22deg' }] }}>
      <View style={{ flex: 1, backgroundColor: '#69c54a', borderRadius: 2 }} />
      <View style={{ flex: 1, backgroundColor: '#42a737', borderRadius: 2, marginTop: -size * 0.18 }} />
    </View>
  );
}

function StatusStrip() {
  return (
    <View style={styles.statusStrip}>
      <Text style={styles.statusTime}>9:41</Text>
      <View style={styles.statusIcons}>
        <Text style={styles.statusIcon}>▮▮▮</Text>
        <Text style={styles.statusIcon}>⌁</Text>
        <View style={styles.battery} />
      </View>
    </View>
  );
}

function HomeIndicator() {
  return <View style={styles.homeIndicator} />;
}

function RoundButton({ glyph, label, onPress }: { glyph: string; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
      <Text style={styles.roundButtonText}>{glyph}</Text>
    </Pressable>
  );
}

function MerchantBadge({ kind, size = 36 }: { kind: Merchant; size?: number }) {
  const color = kind === 'noon' ? '#ffe500' : kind === 'jarir' ? '#e41e2b' : '#ffffff';
  const fg = kind === 'jarir' ? '#fff' : kind === 'noon' ? '#111827' : '#0b75bd';
  const label = kind === 'extra' ? 'extra' : kind === 'jarir' ? 'ج' : 'noon';
  return (
    <View style={[styles.merchantBadge, { width: size, height: size, borderRadius: kind === 'jarir' ? size / 2 : 9, backgroundColor: color }]}> 
      <Text style={{ color: fg, fontWeight: '900', fontSize: kind === 'noon' ? size * 0.22 : size * 0.28, lineHeight: size * 0.32 }}>{label}</Text>
    </View>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <View style={styles.progressTrackSmall}>
      <View style={[styles.progressFillSmall, { width: `${Math.max(4, Math.min(100, value * 100))}%` }]} />
    </View>
  );
}

function SegTabs({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <View style={styles.tabs}>
      {['All', 'Active', 'Completed'].map((tab) => (
        <Pressable key={tab} onPress={() => onChange(tab)} style={[styles.tab, value === tab && styles.tabActive]} accessibilityRole="tab">
          <Text style={[styles.tabText, value === tab && styles.tabTextActive]}>{tab}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function AppShell({ children, route, setRoute, scroll = true }: { children: React.ReactNode; route: RouteKey; setRoute: (r: RouteKey) => void; scroll?: boolean }) {
  const { width } = useWindowDimensions();
  const maxWidth = Math.min(430, width);
  const content = <View style={[styles.phone, { maxWidth }]}>{children}</View>;
  return (
    <SafeAreaView style={styles.outer}>
      <StatusBar style="dark" />
      {scroll ? <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={styles.outerScroll} showsVerticalScrollIndicator={false}>{content}</ScrollView> : <View style={styles.outerScroll}>{content}</View>}
    </SafeAreaView>
  );
}

function Header({ title, subtitle, showLogo, rightClose, onBack, onClose }: { title?: string; subtitle?: string; showLogo?: boolean; rightClose?: boolean; onBack: () => void; onClose?: () => void }) {
  return (
    <View style={styles.headerBlock}>
      <View style={styles.headerRow}>
        <RoundButton glyph="‹" label="Back" onPress={onBack} />
        {showLogo ? <TasheelMark size={26} /> : title ? <Text style={styles.centerTitle}>{title}</Text> : <View />}
        {rightClose ? <RoundButton glyph="×" label="Close" onPress={onClose || onBack} /> : <View style={{ width: 44 }} />}
      </View>
      {title && showLogo ? <Text style={styles.pageTitle}>{title}</Text> : null}
      {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function Checkout({ setRoute }: { setRoute: (r: RouteKey) => void }) {
  return (
    <AppShell route="checkout" setRoute={setRoute}>
      <View style={styles.checkoutPage}>
        <Text style={styles.checkoutMerchant}>Extrastores</Text>
        <Text style={styles.checkoutSub}>Complete your purchase</Text>
        <View style={styles.productCard}>
          <Text style={styles.productIcon}>▣</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.productTitle}>iPhone 16 Pro Max</Text>
            <Text style={styles.productMeta}>256GB — Natural Titanium</Text>
          </View>
          <Money amount="6,553" size={18} />
        </View>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {['Credit / Debit Card', 'Apple Pay', 'Cash on Delivery'].map((item) => <View key={item} style={styles.optionRow}><Text style={styles.radio}>○</Text><Text style={styles.optionText}>{item}</Text></View>)}
        <View style={[styles.optionRow, styles.optionSelected]}><Text style={styles.radioSelected}>●</Text><View style={{ flex: 1 }}><Text style={styles.optionText}>Tasheel BNPL</Text><Text style={styles.optionSub}>Pay in flexible installments</Text></View></View>
        <Pressable style={styles.cta} onPress={() => setRoute('appHome')} accessibilityRole="button"><Text style={styles.ctaText}>Proceed with Tasheel BNPL</Text></Pressable>
      </View>
    </AppShell>
  );
}

function ActionTile({ label, kind, onPress }: { label: string; kind: Merchant; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.actionTile, pressed && styles.pressed]}>
      <View style={styles.actionIcon}><MerchantBadge kind={kind} size={34} /></View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function AppHome({ setRoute }: { setRoute: (r: RouteKey) => void }) {
  return (
    <AppShell route="appHome" setRoute={setRoute} scroll={false}>
      <StatusStrip />
      <View style={styles.homeTopGradient} />
      <View style={styles.appContentNoScroll}>
        <TasheelMark size={30} />
        <Text style={styles.nextPaymentLabel}>Your Next Payment</Text>
        <View style={styles.payRow}><Money amount="4,250" decimals=".00" size={31} /><Pressable style={styles.payNow} onPress={() => setRoute('detail')}><Text style={styles.payNowText}>Pay now</Text></Pressable></View>
        <Text style={styles.dueText}>Jarir Store · due Apr 21</Text>
        <View style={styles.actionsRow}>
          <ActionTile label="My Dues" kind="extra" onPress={() => setRoute('dues')} />
          <ActionTile label="My Purchases" kind="extra" onPress={() => setRoute('purchases')} />
          <ActionTile label="My Insights" kind="extra" onPress={() => setRoute('insights')} />
        </View>
        <SectionHeader title="Active Purchases" onPress={() => setRoute('purchases')} />
        <Pressable style={styles.homeCard} onPress={() => setRoute('detail')}>
          <CardTop kind="extra" title="Extrastores" sub="Feb 5" status="Active" />
          <Installment amount="450" text="1 of 3 installments paid" value={1/3} />
        </Pressable>
        <SectionHeader title="Next up" onPress={() => setRoute('dues')} />
        <View style={styles.nextCard}>
          <NextRow kind="extra" name="Extrastores" when="Tomorrow" amount="343.12" live />
          <Divider />
          <NextRow kind="jarir" name="Jarir Bookstore" when="In 6 days · April 20th" amount="250.50" />
          <Divider />
          <NextRow kind="noon" name="Noon" when="In 17 days · May 15th" amount="123.24" />
        </View>
      </View>
      <BottomNav active="bnpl" setRoute={setRoute} />
      <HomeIndicator />
    </AppShell>
  );
}

function SectionHeader({ title, onPress }: { title: string; onPress: () => void }) {
  return <View style={styles.sectionRow}><Text style={styles.sectionTitleSmall}>{title}</Text><Pressable onPress={onPress}><Text style={styles.viewMore}>View More ›</Text></Pressable></View>;
}

function CardTop({ kind, title, sub, status }: { kind: Merchant; title: string; sub: string; status?: string }) {
  return <View style={styles.cardTop}><MerchantBadge kind={kind} size={38}/><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardSub}>{sub}</Text></View>{status ? <Text style={styles.statusText}>{status}</Text> : null}</View>;
}

function Installment({ text: label, amount, value }: { text: string; amount: string; value: number }) {
  return <><View style={styles.installmentRow}><Text style={styles.installText}>{label}</Text><View style={styles.amountMonthly}><Money amount={amount} decimals=".00" size={16}/><Text style={styles.mo}>/mo</Text></View></View><Progress value={value}/></>;
}

function NextRow({ kind, name, when, amount, live }: { kind: Merchant; name: string; when: string; amount: string; live?: boolean }) {
  return <View style={styles.nextRow}><View><MerchantBadge kind={kind} size={34}/>{live ? <View style={styles.liveDot}/> : null}</View><View style={{ flex: 1 }}><Text style={styles.nextName}>{name}</Text><Text style={[styles.nextWhen, live && { color: '#139b34', fontWeight: '700' }]}>{when}</Text></View><Money amount={amount} size={16}/></View>;
}

function Divider() { return <View style={styles.divider} />; }

function Detail({ setRoute }: { setRoute: (r: RouteKey) => void }) {
  const rows = [
    ['Total Amount', '3,666'], ['Monthly Payment', '916.50'], ['Installments', '4 Installments'], ['Next Due Date', 'May 15th'], ['Monthly Payment', '916.50'], ['Total Paid', '916.50'], ['Remaining', '2,750'], ['Reference', 'TXN-2026-04152'],
  ];
  return (
    <AppShell route="detail" setRoute={setRoute}>
      <StatusStrip />
      <View style={styles.appContent}>
        <Header onBack={() => setRoute('appHome')} />
        <View style={styles.detailHero}>
          <CardTop kind="extra" title="Extrastores" sub="25th of April, 2026" status="Active" />
          <View style={styles.detailAmount}><View/><Money amount="3,666" decimals=".00" size={20}/></View>
          <Progress value={0.25}/>
          <View style={styles.detailPaidRow}><View><Text style={styles.cardSub}>1 Paid</Text><Money amount="916.50" size={14}/></View><View style={{ alignItems: 'flex-end' }}><Text style={styles.cardSub}>3 Remaining</Text><Money amount="2,750" size={14}/></View></View>
        </View>
        <Text style={styles.blockTitle}>Payment Schedule</Text>
        <View style={styles.scheduleCard}>{['May 15th|Due in 8 days|916.50|1','June 15th|Due in 35 days|916.50|0','July 15th|Due in 35 days|916.50|0','August 15th|Due in 35 days|916.50|0'].map((s, i) => { const [date,note,amt,next]=s.split('|'); return <View key={date} style={styles.scheduleRow}><View style={styles.timeline}><View style={[styles.timelineDot, next==='1' && styles.timelineDotActive]} />{i<3 && <View style={styles.timelineLine}/>}</View><View style={{ flex: 1, paddingBottom: i<3 ? 14 : 0 }}><View style={styles.scheduleTop}>{next==='1' && <Text style={styles.nextPill}>Next</Text>}<Text style={[styles.scheduleDate, next==='1' && { color: '#139b34' }]}>{date}</Text><View style={{ flex: 1 }}/><Money amount={amt} size={14}/></View><Text style={styles.cardSub}>{note}</Text></View></View> })}</View>
        <Text style={styles.blockTitle}>Purchase Details</Text>
        <View style={styles.detailsTable}>{rows.map(([label, value], i) => <View key={`${label}-${i}`} style={styles.tableRow}><Text style={styles.tableLabel}>{label}</Text><Text style={[styles.tableValue, label==='Remaining' && { color: '#c8212d' }, label==='Total Paid' && { color: '#14983a' }]}>{['3,666','916.50','2,750'].includes(value) ? '﷼ ' : ''}{value}</Text></View>)}</View>
        <Pressable style={styles.cta} onPress={() => setRoute('appHome')}><Text style={styles.ctaText}>Pay Next Installment</Text></Pressable>
        <HomeIndicator />
      </View>
    </AppShell>
  );
}

function Insights({ setRoute }: { setRoute: (r: RouteKey) => void }) {
  const bars = [0.35, 0.52, 0.42, 0.62, 0.49, 0.92];
  return (
    <AppShell route="insights" setRoute={setRoute} scroll={false}>
      <StatusStrip />
      <View style={styles.appContentNoScroll}>
        <View style={styles.headerRow}><RoundButton glyph="‹" label="Back" onPress={() => setRoute('appHome')} /><Text style={styles.centerTitle}>Insights</Text><Pressable style={styles.monthPill}><Text style={styles.monthText}>⌄ April</Text></Pressable></View>
        <Text style={styles.insightLabel}>Spent in April</Text>
        <Money amount="4,300" size={32}/>
        <View style={styles.chart}>{['Nov','Dec','Jan','Feb','Mar','Apr'].map((m, i) => <View key={m} style={styles.barCol}>{i===5 && <Text style={styles.barValue}>4.3k</Text>}<View style={[styles.bar, { height: 70 * bars[i] }, i===5 && styles.barActive]} /><Text style={[styles.barLabel, i===5 && { color: text, fontWeight: '800' }]}>{m}</Text>{i===5 && <View style={styles.barUnderline}/>}</View>)}</View>
        <View style={styles.insightTabs}><Text style={styles.insightTabActive}>Transactions</Text><Text style={styles.insightTab}>Categories</Text></View>
        <View style={styles.transactionList}>
          <Tx kind="extra" name="Extrastores" date="Apr 15th · Paid" />
          <Tx kind="jarir" name="Jarir" date="Apr 20th · Paid" />
          <Tx kind="jarir" name="Jarir" date="Apr 20th · Paid" />
          <Tx kind="noon" name="Noon" date="Apr 15th · Paid" />
        </View>
        <HomeIndicator />
      </View>
    </AppShell>
  );
}

function Tx({ kind, name, date }: { kind: Merchant; name: string; date: string }) {
  return <View style={styles.txRow}><MerchantBadge kind={kind} size={38}/><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{name}</Text><Text style={styles.cardSub}>{date}</Text></View><Money amount="600" size={16}/></View>;
}

const purchases = [
  ['extra','Extrastores','Samsung Galaxy S26','1','3','450','Active'],
  ['extra','Extrastores','Samsung Galaxy S26','2','3','450','Active'],
  ['jarir','Jarir Bookstore','MacBook Air M4','1','2','720','Active'],
  ['noon','Noon','Multiple products','1','4','320','Active'],
  ['extra','Extrastores','AirPods Pro 3','3','3','210','Completed'],
] as const;

function Purchases({ setRoute }: { setRoute: (r: RouteKey) => void }) {
  const [tab, setTab] = useState('All');
  const filtered = purchases.filter((p) => tab === 'All' || p[6] === tab);
  return (
    <AppShell route="purchases" setRoute={setRoute}>
      <StatusStrip />
      <View style={styles.appContent}>
        <Header title="My Purchases" subtitle="View all your purchases" showLogo rightClose onBack={() => setRoute('appHome')} onClose={() => setRoute('appHome')} />
        <SegTabs value={tab} onChange={setTab} />
        <View style={styles.purchaseList}>{filtered.map(([kind,name,product,paid,count,amount,status], i) => <Pressable key={`${name}-${product}-${i}`} style={styles.purchaseCard} onPress={() => setRoute('detail')}><CardTop kind={kind} title={name} sub={product} status={status}/><Installment text={`${paid} of ${count} installments paid`} amount={amount} value={Number(paid)/Number(count)} /></Pressable>)}</View>
        <HomeIndicator />
      </View>
    </AppShell>
  );
}

function Dues({ setRoute }: { setRoute: (r: RouteKey) => void }) {
  const dues = [
    { kind: 'extra' as Merchant, name: 'Extra Stores', amount: 1800, when: 'In 2 days · April 20th', of: '2 of 4', selected: true },
    { kind: 'jarir' as Merchant, name: 'Jarir', amount: 600, when: 'In 7 days · April 27th', of: '2 of 4', selected: true },
    { kind: 'jarir' as Merchant, name: 'Jarir', amount: 600, when: 'In 7 days · April 27th', of: '2 of 4', selected: true },
    { kind: 'jarir' as Merchant, name: 'Jarir', amount: 600, when: 'In 7 days · April 27th', of: '2 of 4', selected: false },
  ];
  return (
    <AppShell route="dues" setRoute={setRoute}>
      <StatusStrip />
      <View style={styles.appContent}>
        <Header onBack={() => setRoute('appHome')} />
        <View style={styles.ringWrap}><SegmentRing /><Text style={styles.ringLabel}>4 Dues Selected</Text><Money amount="1,800" size={32}/><Text style={styles.ringSub}>Remaining 1200</Text></View>
        <View style={styles.duesList}>{dues.map((d, i) => <Pressable key={i} style={[styles.dueRow, d.selected && styles.dueRowSelected]}><MerchantBadge kind={d.kind} size={40}/><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{d.name}</Text><Text style={styles.cardSub}>{d.when}</Text></View><View style={{ alignItems: 'flex-end' }}><Money amount={String(d.amount)} size={16}/><Text style={styles.cardSub}>{d.of}</Text></View></Pressable>)}</View>
        <View style={styles.moreRow}><Text style={styles.cardSub}>+5 More next up payments</Text><Pressable onPress={() => setRoute('purchases')}><Text style={styles.viewAllDark}>View all ›</Text></Pressable></View>
        <Pressable style={styles.cta} onPress={() => setRoute('appHome')}><Text style={styles.ctaText}>Pay selected <Text>﷼ 3,000</Text></Text></Pressable>
        <HomeIndicator />
      </View>
    </AppShell>
  );
}

function SegmentRing() {
  const dots: Array<{ x: number; y: number; c: string }> = [
    { x: 14, y: 132, c: '#78ff22' },
    { x: 65, y: 32, c: '#1d7c2b' },
    { x: 164, y: 46, c: '#8fbf83' },
    { x: 154, y: 158, c: '#b4e875' },
    { x: 68, y: 182, c: '#b4e875' },
    { x: 18, y: 76, c: '#eff2ef' },
  ];
  return <View style={styles.ringBase}><View style={styles.ringArc} /><View style={styles.ringArcTwo} />{dots.map((dot, i) => <View key={i} style={[styles.ringDot, { left: dot.x, top: dot.y, backgroundColor: dot.c }]} />)}</View>;
}

function BottomNav({ active, setRoute }: { active: string; setRoute: (r: RouteKey) => void }) {
  return <View style={styles.bottomNav}>{[['Home','⌂','appHome'],['Flash Cash','ϟ','checkout'],['BNPL','▣','appHome'],['Profile','◉','appHome']].map(([label, icon, route]) => <Pressable key={label} onPress={() => setRoute(route as RouteKey)} style={[styles.navItem, label==='BNPL' && styles.navActive]}><Text style={styles.navIcon}>{icon}</Text><Text style={styles.navText}>{label}</Text></Pressable>)}</View>;
}

export default function App() {
  const initial = useMemo(() => routeFromPath(currentPath()), []);
  const [route, setRouteState] = useState<RouteKey>(initial);
  const setRoute = (r: RouteKey) => {
    setRouteState(r);
    const map: Record<RouteKey, string> = { checkout: '/checkout', appHome: '/checkout/app-home', detail: '/checkout/detail', insights: '/checkout/insights', purchases: '/checkout/purchases', dues: '/checkout/dues' };
    pushPath(map[r]);
  };
  if (route === 'appHome') return <AppHome setRoute={setRoute} />;
  if (route === 'detail') return <Detail setRoute={setRoute} />;
  if (route === 'insights') return <Insights setRoute={setRoute} />;
  if (route === 'purchases') return <Purchases setRoute={setRoute} />;
  if (route === 'dues') return <Dues setRoute={setRoute} />;
  return <Checkout setRoute={setRoute} />;
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: '#e5e7eb', alignItems: 'center' },
  outerScroll: { flexGrow: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-start' },
  phone: { width: '100%', minHeight: '100%', backgroundColor: canvas, overflow: 'hidden' },
  statusStrip: { height: 32, paddingHorizontal: 26, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusTime: { fontSize: 13, fontWeight: '800', color: '#000' },
  statusIcons: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusIcon: { fontSize: 10, color: '#000', fontWeight: '900' },
  battery: { width: 18, height: 8, borderRadius: 2, backgroundColor: '#111' },
  homeIndicator: { alignSelf: 'center', width: 134, height: 5, borderRadius: 4, backgroundColor: '#000', marginTop: 10, marginBottom: 8 },
  appContent: { paddingHorizontal: 20, paddingBottom: 12 },
  appContentNoScroll: { paddingHorizontal: 20, paddingBottom: 12, flex: 1 },
  headerBlock: { marginBottom: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roundButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#0b3d1e', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, borderWidth: 0.5, borderColor: border },
  roundButtonText: { fontSize: 28, lineHeight: 30, fontWeight: '700', color: text },
  pressed: { opacity: 0.78 },
  centerTitle: { fontSize: 16, fontWeight: '700', color: text },
  pageTitle: { fontSize: 30, lineHeight: 34, fontWeight: '900', color: text, marginTop: 16, letterSpacing: -0.8 },
  pageSubtitle: { color: muted, fontSize: 14, marginTop: 3 },
  checkoutPage: { padding: 22, gap: 14 },
  checkoutMerchant: { fontSize: 28, fontWeight: '900', color: text },
  checkoutSub: { color: muted, fontSize: 15 },
  productCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 16, borderRadius: 20, borderColor: border, borderWidth: 1 },
  productIcon: { fontSize: 24 },
  productTitle: { fontSize: 16, fontWeight: '800', color: text },
  productMeta: { fontSize: 13, color: muted, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: text, marginTop: 8 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: border },
  optionSelected: { borderColor: green, backgroundColor: '#effaf1' },
  radio: { fontSize: 18, color: muted },
  radioSelected: { fontSize: 18, color: green },
  optionText: { fontSize: 15, fontWeight: '800', color: text },
  optionSub: { fontSize: 12, color: muted, marginTop: 2 },
  cta: { minHeight: 54, borderRadius: 18, backgroundColor: green, alignItems: 'center', justifyContent: 'center', marginTop: 14, paddingHorizontal: 18 },
  ctaText: { color: neon, fontSize: 15, fontWeight: '900' },
  homeTopGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 260, backgroundColor: '#e3f0e7' },
  nextPaymentLabel: { color: muted, fontSize: 13, marginTop: 18 },
  payRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  payNow: { backgroundColor: green, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 18, marginLeft: 'auto' },
  payNowText: { color: neon, fontWeight: '800', fontSize: 13 },
  dueText: { color: muted, fontSize: 13, marginTop: 3 },
  actionsRow: { flexDirection: 'row', justifyContent: 'center', gap: 22, marginTop: 22, marginBottom: 8 },
  actionTile: { alignItems: 'center', gap: 7 },
  actionIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#0b3d1e', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
  actionLabel: { fontSize: 12, color: text, fontWeight: '700' },
  sectionRow: { marginTop: 18, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitleSmall: { color: text, fontSize: 16, fontWeight: '900' },
  viewMore: { color: green, fontSize: 12, fontWeight: '900' },
  homeCard: { backgroundColor: '#fff', borderRadius: 20, padding: 14, borderWidth: 0.5, borderColor: border, shadowColor: '#0b3d1e', shadowOpacity: 0.05, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  merchantBadge: { alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: border, overflow: 'hidden' },
  cardTitle: { fontSize: 15, color: text, fontWeight: '900' },
  cardSub: { fontSize: 12, color: muted, marginTop: 1 },
  statusText: { fontSize: 12, fontWeight: '900', color: '#087c2d' },
  installmentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  installText: { color: '#374151', fontSize: 12 },
  amountMonthly: { flexDirection: 'row', alignItems: 'baseline' },
  mo: { color: muted, fontSize: 12, marginLeft: 2 },
  progressTrackSmall: { height: 8, borderRadius: 999, backgroundColor: '#e6e8eb', overflow: 'hidden', marginTop: 8 },
  progressFillSmall: { height: 8, borderRadius: 999, backgroundColor: '#27d552' },
  nextCard: { backgroundColor: '#fff', borderRadius: 20, padding: 14, borderWidth: 0.5, borderColor: border },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  nextName: { fontSize: 15, fontWeight: '900', color: text },
  nextWhen: { fontSize: 12, color: muted, marginTop: 1 },
  liveDot: { position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: '#23c140', borderWidth: 2, borderColor: '#fff' },
  divider: { height: 1, backgroundColor: border, marginVertical: 12 },
  bottomNav: { marginHorizontal: 20, marginTop: 'auto', height: 64, borderRadius: 32, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', shadowColor: '#0b3d1e', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
  navItem: { width: 78, alignItems: 'center', justifyContent: 'center', gap: 2 },
  navActive: { backgroundColor: '#eaf4ec', borderRadius: 24, height: 48 },
  navIcon: { fontSize: 19, color: text, fontWeight: '900' },
  navText: { fontSize: 10, color: text, fontWeight: '700' },
  detailHero: { backgroundColor: '#fff', borderRadius: 20, padding: 14, borderWidth: 0.5, borderColor: border },
  detailAmount: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -8 },
  detailPaidRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  blockTitle: { marginTop: 18, marginBottom: 10, fontSize: 18, fontWeight: '900', color: text },
  scheduleCard: { backgroundColor: '#fff', borderRadius: 20, padding: 14, borderWidth: 0.5, borderColor: border },
  scheduleRow: { flexDirection: 'row', gap: 12 },
  timeline: { alignItems: 'center', width: 16 },
  timelineDot: { width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: '#d1d5db', backgroundColor: '#fff' },
  timelineDotActive: { backgroundColor: '#169c39', borderColor: '#169c39' },
  timelineLine: { flex: 1, width: 2, backgroundColor: '#e5e7eb', marginVertical: 2 },
  scheduleTop: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  nextPill: { backgroundColor: '#e5f8e9', color: '#15963a', fontSize: 11, fontWeight: '900', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
  scheduleDate: { fontSize: 15, fontWeight: '900', color: text },
  detailsTable: { backgroundColor: '#fff', borderRadius: 20, borderWidth: 0.5, borderColor: border, overflow: 'hidden' },
  tableRow: { minHeight: 42, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: border },
  tableLabel: { color: muted, fontSize: 13 },
  tableValue: { color: text, fontSize: 13, fontWeight: '900' },
  monthPill: { height: 36, borderRadius: 18, paddingHorizontal: 15, backgroundColor: '#fff', justifyContent: 'center', borderWidth: 0.5, borderColor: border },
  monthText: { fontWeight: '700', color: text, fontSize: 13 },
  insightLabel: { marginTop: 18, color: muted, fontSize: 13 },
  chart: { height: 130, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginTop: 12, marginBottom: 14 },
  barCol: { alignItems: 'center', justifyContent: 'flex-end', width: 42 },
  bar: { width: 16, borderRadius: 9, backgroundColor: '#d5dbe1' },
  barActive: { backgroundColor: '#22db3f' },
  barValue: { color: '#087c2d', fontSize: 10, fontWeight: '900', marginBottom: 5 },
  barLabel: { marginTop: 8, fontSize: 11, color: muted },
  barUnderline: { width: 24, height: 2, backgroundColor: text, marginTop: 5 },
  insightTabs: { height: 44, borderRadius: 22, backgroundColor: '#eceff1', flexDirection: 'row', alignItems: 'center', padding: 3, marginBottom: 14 },
  insightTabActive: { flex: 1, height: 38, borderRadius: 19, backgroundColor: '#fff', textAlign: 'center', textAlignVertical: 'center', lineHeight: 38, color: '#087c2d', fontWeight: '900' },
  insightTab: { flex: 1, textAlign: 'center', color: muted, fontWeight: '700' },
  transactionList: { gap: 10 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 17, padding: 12, borderWidth: 0.5, borderColor: border },
  tabs: { height: 44, borderRadius: 22, backgroundColor: '#eceff1', flexDirection: 'row', alignItems: 'center', padding: 3, marginBottom: 14 },
  tab: { flex: 1, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  tabText: { color: muted, fontWeight: '800', fontSize: 13 },
  tabTextActive: { color: '#087c2d' },
  purchaseList: { gap: 12 },
  purchaseCard: { backgroundColor: '#fff', borderRadius: 20, borderWidth: 0.5, borderColor: border, padding: 14, shadowColor: '#0b3d1e', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  ringWrap: { alignItems: 'center', marginTop: 4, marginBottom: 18 },
  ringBase: { width: 214, height: 214, borderRadius: 107, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', shadowColor: '#0b3d1e', shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  ringArc: { position: 'absolute', width: 214, height: 214, borderRadius: 107, borderWidth: 23, borderColor: '#51ef1a', borderLeftColor: 'transparent', transform: [{ rotate: '-28deg' }] },
  ringArcTwo: { position: 'absolute', width: 214, height: 214, borderRadius: 107, borderWidth: 23, borderColor: 'transparent', borderRightColor: '#2f8d2e', borderTopColor: '#1f7d2a', transform: [{ rotate: '18deg' }] },
  ringDot: { position: 'absolute', width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)' },
  ringLabel: { marginTop: -132, fontSize: 13, color: muted },
  ringSub: { fontSize: 13, color: muted, marginTop: 2 },
  duesList: { gap: 10 },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 18, borderWidth: 0.5, borderColor: border, padding: 12 },
  dueRowSelected: { borderColor: '#2FB300', borderWidth: 1.3, backgroundColor: '#f8fff8' },
  moreRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  viewAllDark: { color: text, fontWeight: '800', fontSize: 13 },
});
