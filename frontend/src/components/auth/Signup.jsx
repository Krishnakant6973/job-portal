import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Codepen, Loader2 } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(input)
        const formData = new FormData();    //formdata object
        formData.append("fullName", input.fullName.trim());
        formData.append("email", input.email.trim().toLowerCase());
        formData.append("phoneNumber", input.phoneNumber.trim());
        formData.append("password", input.password.trim());
        formData.append("role", input.role.trim());
        if (input.file) {
            formData.append("file", input.file);
        }

        // Full Name validation
        const fullName = formData.get("fullName")
        if (!fullName) {
            toast.error("Full name is required.");
            return;
        } else if (!/^[a-zA-Z\s]{3,50}$/.test(fullName)) {
            toast.error("Full name must be between 3-50 characters and contain only letters.");
            return;
        }

        // Email validation
        const email = formData.get("email")
        if (!email) {
            toast.error("Email is required.");
            return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        // Phone Number validation
        const phoneNumber = formData.get("phoneNumber")
        if (!phoneNumber) {
            toast.error("Phone number is required.");
            return;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            toast.error("Phone number must be a 10-digit number.");
            return;
        }

        // Password validation
        const password = formData.get("password")
        if (!password) {
            toast.error("Password is required.");
            return;
        } else if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        } else if (!/[A-Z]/.test(password)) {
            toast.error("Password must contain at least one uppercase letter.");
            return;
        } else if (!/[a-z]/.test(password)) {
            toast.error("Password must contain at least one lowercase letter.");
            return;
        } else if (!/[0-9]/.test(password)) {
            toast.error("Password must contain at least one number.");
            return;
        } else if (!/[!@#$%^&*]/.test(password)) {
            toast.error("Password must contain at least one special character (!@#$%^&*).");
            return;
        }

        // Image validation
        const file = formData.get("file")
        if (!file) {
            toast.error("Image file is required.");
            return;
        } else {
            const allowedFormats = ["image/jpeg", "image/png"];
            if (!allowedFormats.includes(file.type)) {
                toast.error("Only JPG and PNG formats are allowed.");
                return;
            }
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                toast.error("File size must not exceed 2MB.");
                return;
            }
        }

        const role = formData.get("role")
        if (!role) {
            toast.error("Role is required.");
            return;
        }
        else {
            const allowedRoles = ["student", "recruiter"];
            if (!allowedRoles.includes(role)) {
                toast.error("Only student and recruiter roles are allowed.");
                return;
            }
        }


        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullName}
                            name="fullName"
                            onChange={changeEventHandler}
                            placeholder="krishnakant"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="kk@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="tel"
                            value={input.phoneNumber}
                            name="phoneNumber"

                            onChange={changeEventHandler}
                            placeholder="8888888888"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="password"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4" disabled={loading}> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Signup</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup