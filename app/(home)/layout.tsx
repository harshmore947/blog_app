import UserSync from "@/components/auth/UserSync";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <UserSync />
      {children}
    </div>
  );
}
