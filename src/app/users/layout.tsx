import { Input } from "@/components/ui/input";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="p-2">
      <Input placeholder="Search..." />
      {children}
    </section>
  );
}
