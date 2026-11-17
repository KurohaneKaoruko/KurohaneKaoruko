import { ArchiveFooter } from "@/components/layout/ArchiveFooter";
import { ThemedFooter } from "@/components/layout/ThemedFooter";
import { DefaultFooter } from "@/components/themes/default/Footer";

export default function Footer() {
  return (
    <ThemedFooter current={<DefaultFooter />} legacy={<ArchiveFooter />} />
  );
}
