import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: Facebook,
    color: "hover:text-blue-600",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: Instagram,
    color: "hover:text-pink-600",
  },
  {
    name: "Youtube",
    href: "https://youtube.com",
    icon: Youtube,
    color: "hover:text-red-600",
  },
];

function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">BloodLink</span>
            </div>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              BloodLink là nền tảng kết nối người hiến máu và người cần máu, góp
              phần xây dựng cộng đồng hiến máu tình nguyện, lan tỏa những giá
              trị nhân văn tốt đẹp.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 transition-colors ${item.color}`}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="md:col-span-3">
            <div className="rounded-lg overflow-hidden shadow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.163958945935!2d106.79814837480637!3d10.875131189279651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2sVNUHCM%20Student%20Cultural%20House!5e0!3m2!1sen!2s!4v1752745803478!5m2!1sen!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="text-sm">support@bloodlink.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span className="text-sm">1900 1234</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Hồ Chí Minh, Việt Nam</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t py-6">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} BloodLink. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
