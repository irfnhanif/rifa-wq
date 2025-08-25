// resources/js/Components/AppNavbar.tsx
import { Link } from '@inertiajs/react';
import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarBrand } from 'flowbite-react';
import { Bell, Cog, LogOut } from 'lucide-react';
import React from 'react';

const AppNavbar: React.FC = () => {
    return (
        <Navbar
            fluid
            rounded
            // Replaced theme colors with direct hex values
            className="border-b border-[#E5E7EB] bg-[#F9FAFB] px-28 py-6"
        >
            <NavbarBrand as={Link} href="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className=" ml-3 mr-3 h-7 w-7">
                    <path
                        fill="#039be5"
                        d="M28.967 12H9.442a2 2 0 0 0-1.898 1.368L4 24V10h24a2 2 0 0 0-2-2H15.124a2 2 0 0 1-1.28-.464l-1.288-1.072A2 2 0 0 0 11.276 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h22l4.805-11.212A2 2 0 0 0 28.967 12"
                    />
                    <path
                        fill="#b3e5fc"
                        d="M24 16v-2h-3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3v-2h-2v-8Zm8-2v-2h-5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-2h-4V14Zm-16 2h2v8h-2z"
                    />
                </svg>
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#101828]">RIFA-WQ</span>
            </NavbarBrand>
            <div className="flex items-center gap-2 md:order-2">
                <Button outline>
                    <Bell className="h-5 w-5" />
                </Button>
                <Dropdown arrowIcon={false} inline label={<Avatar alt="User settings" img="https://placehold.co/32x32" rounded />}>
                    <DropdownHeader>
                        <span className="block text-sm">Jese Leos</span>
                        <span className="block truncate text-sm font-medium">name@example.com</span>
                    </DropdownHeader>
                    <DropdownItem icon={Cog}>Pengaturan</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem icon={LogOut}>Keluar</DropdownItem>
                </Dropdown>
            </div>
        </Navbar>
    );
};

export default AppNavbar;
