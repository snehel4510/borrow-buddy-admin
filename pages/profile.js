import Layout from "@/components/layout";
import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import { states } from "@/components/states";
import axios from "axios";
import { useRouter } from "next/router";

export default function Profile() {

    const { data: session } = useSession();
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [existingProfile, setExistingProfile] = useState(null);

    const [formData, setFormData] = useState({
        user: '',
        name: '',
        state: '',
        college: '',
        year: '',
        branch: '',
        enroll: '',
        phone: ''
    });

    const handleStateChange = (value) => {
        setFormData((prevData) => ({ ...prevData, state: value, college: '' }));
    };

    const handleCollegeChange = (value) => {
        setFormData((prevData) => ({ ...prevData, college: value }));
    };

    const handleEditModeToggle = () => {
        setIsEditMode((prevMode) => !prevMode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.user = session?.user?.email;
        formData.name = session?.user?.name;
        try {
            const existingProfile = await axios.get(`/api/update-user?email=${formData.user}`);
            if (existingProfile.data) {
                await axios.put('/api/update-user', formData);
            } else {
                await axios.post('/api/update-user', formData);
            }
            setIsEditMode(false);
            router.push('/');
        } catch (error) {
            console.error('Error checking or updating profile:', error);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/get-profile?email=${session?.user?.email}`);
                setExistingProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [session]);

    return (
        <Layout>

            <div className="text-blue-900 flex justify-between">
                <h1> Hello, <b>{session?.user?.name}</b> </h1>
                <img src={session?.user?.image} alt="profilepic" className="w-10 h-10 rounded-full" />
            </div>


            {existingProfile && !isEditMode ? (
                <>
                    <div className="my-8 p-6 bg-white rounded-md shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Your Profile Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">College:</p>
                                <p className="font-semibold">{existingProfile.college}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Year:</p>
                                <p className="font-semibold">{existingProfile.year}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Branch:</p>
                                <p className="font-semibold">{existingProfile.branch}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Enrollment:</p>
                                <p className="font-semibold">{existingProfile.enroll}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Phone:</p>
                                <p className="font-semibold">{existingProfile.phone}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleEditModeToggle}
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-800"
                    >
                        Edit Profile
                    </button>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">
                            {isEditMode ? 'Edit Your Profile' : "You Don't Have a Profile, Create One"}
                        </h2>
                        {isEditMode && (
                            <button
                                onClick={() => setIsEditMode(false)}
                                className="text-red-500 hover:text-red-600 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State
                        </label>
                        <input
                            type="text"
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleStateChange(e.target.value)}
                            placeholder="Enter your state"
                            list="states"
                            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:border-blue-500"
                        />
                        <datalist id="states">
                            {states.map((state) => (
                                <option key={state.state} value={state.state} />
                            ))}
                        </datalist>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                            College
                        </label>
                        <input
                            type="text"
                            id="college"
                            value={formData.college}
                            onChange={(e) => handleCollegeChange(e.target.value)}
                            placeholder="Enter your college"
                            list={`colleges-${formData.state}`}
                            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:border-blue-500"
                        />
                        <datalist id={`colleges-${formData.state}`}>
                            {states.find((s) => s.state === formData.state)?.colleges.map((college) => (
                                <option key={college} value={college} />
                            ))}
                        </datalist>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                            Year
                        </label>
                        <input
                            type="number"
                            id="year"
                            value={formData.year}
                            onChange={(e) => setFormData((prevData) => ({ ...prevData, year: e.target.value }))}
                            placeholder="Enter your graduation year"
                            min="1900" // Set your desired minimum year
                            max="2100" // Set your desired maximum year
                            step="1"
                            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="branch" className="block text-gray-700 font-semibold mb-2">
                            Branch
                        </label>
                        <input
                            type="text"
                            id="branch"
                            name="branch"
                            value={formData.branch}
                            onChange={(e) => setFormData((prevData) => ({ ...prevData, branch: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="enroll" className="block text-gray-700 font-semibold mb-2">
                            Enrollment number
                        </label>
                        <input
                            type="text"
                            id="enroll"
                            name="enroll"
                            value={formData.enroll}
                            onChange={(e) => setFormData((prevData) => ({ ...prevData, enroll: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                            Phone number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData((prevData) => ({ ...prevData, phone: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-800"
                    >
                        Save Profile
                    </button>

                </form>
            )}
        </Layout>
    )
}

