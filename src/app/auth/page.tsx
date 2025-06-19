import { SignUpPage } from '@/components/auth/SignUpPage';
import AuthLayout from "@/components/layout/AuthLayout";
import {LoginPage} from "@/components/auth/LoginPage";


export default function SignUpRoutePage() {
    return (
        <AuthLayout>
            <LoginPage />
        </AuthLayout>
    );
}
