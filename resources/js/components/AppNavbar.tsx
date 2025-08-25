// resources/js/Components/AppNavbar.tsx
import { Link } from '@inertiajs/react';
import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarBrand } from 'flowbite-react';
import React from 'react';
import { HiOutlineBell, HiOutlineCog, HiOutlineLogout, HiOutlineSearch } from 'react-icons/hi';

const AppNavbar: React.FC = () => {
    return (
        <Navbar
            fluid
            rounded
            // Replaced theme colors with direct hex values
            className="border-b border-[#E5E7EB] bg-[#F9FAFB] px-28 py-6"
        >
            <NavbarBrand as={Link} href="/">
                <svg className="mr-3 h-7 w-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.668 7.332H32l-6.668 9.332L22.668 7.332z" fill="#0EA5E9"></path>
                    <path d="M12.001 2H2v12l10.001-4V2z" fill="#0EA5E9"></path>
                    <path d="M12.001 10l10.667-2.668L16 16l-3.999-6z" fill="#2563EB"></path>
                    <path d="M22.668 16.668l-4.001-5.336-6.667 9.336h17.336l-6.668-4z" fill="#2563EB"></path>
                </svg>
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#101828]">RIFA-WQ</span>
            </NavbarBrand>
            <div className="flex items-center gap-2 md:order-2">
                <Button color="gray" pill>
                    <HiOutlineSearch className="h-5 w-5" />
                </Button>
                <Button color="gray" pill>
                    <HiOutlineBell className="h-5 w-5" />
                </Button>
                <Dropdown arrowIcon={false} inline label={<Avatar alt="User settings" img="https://placehold.co/32x32" rounded />}>
                    <DropdownHeader>
                        <span className="block text-sm">Jese Leos</span>
                        <span className="block truncate text-sm font-medium">name@example.com</span>
                    </DropdownHeader>
                    <DropdownItem icon={HiOutlineCog}>Settings</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem icon={HiOutlineLogout}>Keluar</DropdownItem>
                </Dropdown>
            </div>
        </Navbar>
    );
};

export default AppNavbar;
