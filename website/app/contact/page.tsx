import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import InquiryForm from "@/components/contact/InquiryForm";
import MapView from "@/components/contact/MapView";
import WhatsAppButton from "@/components/contact/WhatsAppButton";

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-main-50">
      <ContactHero />
      <ContactInfo />
      <MapView />
      <InquiryForm />
      <WhatsAppButton />
    </div>
  );
}
