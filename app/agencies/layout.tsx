/**
 * Layout for agencies listing page
 * AuthProvider is now in the root layout for global access
 */
export default function AgenciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
