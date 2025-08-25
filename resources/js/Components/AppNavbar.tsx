// resources/js/Components/AppNavbar.tsx
import { Link } from '@inertiajs/react';
import { Avatar, Button, Dropdown, Navbar, NavbarBrand, DropdownHeader, DropdownItem, DropdownDivider } from 'flowbite-react';
import React from 'react';
import { HiOutlineBell, HiOutlineCog, HiOutlineLogout, HiOutlineSearch } from 'react-icons/hi';

// A simple SVG Logo to replace the div-based one
const Logo = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.6667 12.1333L15.6667 15.1333L13.6667 20.1333L11.6667 12.1333Z" fill="url(#paint0_linear_1_2)" />
        <path d="M15.6067 0.28L23.6067 4.28L18.6067 8.28L15.6067 0.28Z" fill="url(#paint1_linear_1_2)" />
        {/* Simplified for brevity */}
    </svg>
);

const AppNavbar: React.FC = () => {
    return (
        <Navbar fluid rounded className="bg-background-soft border-border-base border-b px-28 py-6">
            <NavbarBrand as={Link} href="/">
                {/* Using a simplified SVG for the logo */}
                <svg className="mr-3 h-7 w-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.668 7.332H32l-6.668 9.332L22.668 7.332z" fill="#0EA5E9"></path>
                    <path d="M12.001 2H2v12l10.001-4V2z" fill="#0EA5E9"></path>
                    <path d="M12.001 10l10.667-2.668L16 16l-3.999-6z" fill="#2563EB"></path>
                    <path d="M22.668 16.668l-4.001-5.336-6.667 9.336h17.336l-6.668-4z" fill="#2563EB"></path>
                </svg>
                <span className="text-text-heading self-center text-2xl font-semibold whitespace-nowrap">RIFA Work Queue Order</span>
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
