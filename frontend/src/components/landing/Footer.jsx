import { Wrench } from "lucide-react";
const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: ["About", "Careers", "Press"],
  },
  {
    title: "For Clients",
    links: ["Post a Job", "How It Works", "Safety"],
  },
  {
    title: "For Pros",
    links: ["Become a Pro", "Pro Resources", "Pricing"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Us", "Terms of Service"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">FixHive</span>
            </div>
            <p className="text-gray-500 text-sm max-w-[280px]">
              Connecting homeowners with trusted, verified handymen since 2024.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">{column.title}</h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-500 text-sm hover:text-blue-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
          © 2026 FixHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}