import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { messageClear, seller_register } from '../../store/Reducers/authReducer';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);
    const [imgPreview,setImgPreview]=useState('')
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        agree: false,
        phoneNumber: '',
        address: '',
        subCity: '',
        category: '',
        license: null,
    });

    const categories = [
        'Electronics',
        'Books',
        'Clothing',
        'Furniture',
        'Toys',
        'Home & Garden',
        'Sports & Outdoors',
        'Automotive',
        'Health & Beauty',
        'Groceries',
        'Pet Supplies',
        'Arts & Crafts'
    ];

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const handleFileInputChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    const reader = new FileReader();

    reader.onload = () => {
        setState({
            ...state,
            license: file // Set license to the file object itself
        });

        setImgPreview(reader.result);
    };

    if (file) {
        reader.readAsDataURL(file); // Read the file as a data URL
    }
};

    

const submit = (e) => {
    e.preventDefault();

    // Create a new FormData instance
    const formData = new FormData();

    // Append all form fields to formData
    Object.keys(state).forEach(key => {
        formData.append(key, state[key]);
    });

    // Append the file to formData
    if (state.license) {
        formData.append('license', state.license);
    }

    // Dispatch the action with formData instead of the state object
    dispatch(seller_register(formData));
};


    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/');
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch, navigate]);

    return (
        <div className='min-w-screen min-h-screen bg-[#161d31] flex justify-center items-center'>
            <div className='w-[50%] text-[#d0d2d6] p-2'>
                <div className='bg-[#283046] p-4 rounded-md'>
                    <h2 className='text-xl mb-3'>Welcome to Nile Ethiopia</h2>
                    <p className='text-sm mb-3'>Please register to your account and start your business</p>
                    <form onSubmit={submit} enctype="multipart/form-data">
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor="name">Name</label>
                            <input onChange={inputHandle} value={state.name} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden' type="text" name='name' placeholder='Name' id='name' required />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor="email">Email</label>
                            <input onChange={inputHandle} value={state.email} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden' type="email" name='email' placeholder='Email' id='email' required />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor="password">Password</label>
                            <input onChange={inputHandle} value={state.password} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden' type="password" name='password' placeholder='Password' id='password' required />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor='phoneNumber'>Phone Number</label>
                            <input onChange={inputHandle} value={state.phoneNumber} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden'  name='phoneNumber' placeholder='Phone Number' id='phoneNumber' required />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor='address'>Address</label>
                            <input onChange={inputHandle} value={state.address} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden' type='text' name='address' placeholder='Address' id='address' required />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor='subCity'>Sub City</label>
                            <input onChange={inputHandle} value={state.subCity} className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden' type='text' name='subCity' placeholder='Sub City' id='subCity' required />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <select
                                name="category"
                                id="category"
                                onChange={inputHandle}
                                className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor='license'>License</label>
                            <input onChange={handleFileInputChange} name='license' className='px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden' type='file'  id='license' required />
                            {imgPreview && (
                                <img src={imgPreview} alt='License Preview' className='mt-2 w-40 h-auto' />
                            )}
                        </div>
                        <div className='flex items-center w-full gap-3 mb-3'>
                            <input className='w-4 h-4 text-blue-600 overflow-hidden bg-gray-100 rounded border-gray-300 focus:ring-blue-500' onChange={(e) => setState({ ...state, agree: e.target.checked })} type="checkbox" name='agree' id='agree' required />
                            <label htmlFor="agree">Customer Can return Product within 24 hours after Delivery</label>
                        </div>
                        <button disabled={loader ? true : false} className='bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                            {
                                loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Signup'
                            }
                        </button>
                        <div className='flex items-center mb-3 gap-3 justify-center'>
                            <p>Already have an account? <Link to='/login' className='text-blue-500 ml-2'>Signin here</Link></p>
                        </div>
                        <div className='w-full flex justify-center items-center mb-3'>
                            <div className='w-[45%] bg-slate-700 h-[1px]'></div>
                            <div className='w-[10%] flex justify-center items-center'>
                                <span className='pb-1'>Or</span>
                            </div>
                            <div className='w-[45%] bg-slate-700 h-[1px]'></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
