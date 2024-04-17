import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsImages } from 'react-icons/bs'
import { IoCloseSharp } from 'react-icons/io5'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import Select from 'react-tailwindcss-select';
import { PropagateLoader } from 'react-spinners'
import { overrideStyle } from '../../utils/utils'
import { get_category } from '../../store/Reducers/categoryReducer'
import { add_product, messageClear } from '../../store/Reducers/productReducer'
import { useRef } from 'react'
const AddProduct = () => {
    const dispatch = useDispatch()
    const { categorys } = useSelector(state => state.category)
    const { successMessage, errorMessage, loader } = useSelector(state => state.product)
    useEffect(() => {
        dispatch(get_category({
            searchValue: '',
            parPage: '',
            page: ""
        }))
    }, [dispatch])
    const [state, setState] = useState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: "",
        colors:[],
        sizes:[]
    })

    const colorOptions = [
        { value: 'Red', label: 'Red' },
        { value: 'Blue', label: 'Blue' },
        { value: 'Green', label: 'Green' },
        { value: 'Yellow', label: 'Yellow' },
        { value: 'Purple', label: 'Purple' },
        { value: 'Orange', label: 'Orange' },
        { value: 'Pink', label: 'Pink' },
        { value: 'Turquoise', label: 'Turquoise' },
        // Add more colors here
    ];
    

    const sizeOptions = [
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' }
    ];

    const handleColorChange = (selectedOption) => {
        setState(prevState => ({
            ...prevState,
            colors: selectedOption.map(option => option.value)
        }));
    };

    const handleSizeChange = (selectedOption) => {
        setState(prevState => ({
            ...prevState,
            sizes: selectedOption.map(option => option.value)
        }));
    };

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const [cateShow, setCateShow] = useState(false)
    const [category, setCategory] = useState('')
    const [allCategory, setAllCategory] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const categorySearch = (e) => {
        const value = e.target.value
        setSearchValue(value)
        if (value) {
            let srcValue = allCategory.filter(c => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
            setAllCategory(srcValue)
        } else {
            setAllCategory(categorys)
        }
    }
    const [images, setImages] = useState([])
    const [imageShow, setImageShow] = useState([])
    const inmageHandle = (e) => {
        const files = e.target.files
        const length = files.length;
    
        // Check if selecting these images would exceed the limit
        if (imageShow.length + length > 3) {
            // Notify the user that they cannot select more than 3 images
            toast.error("You can select a maximum of 3 images.");
            return; // Exit early
        }
    
        // Proceed with adding images if within the limit
        if (length > 0) {
            setImages([...images, ...files])
            let imageUrl = []
    
            for (let i = 0; i < length; i++) {
                imageUrl.push({ url: URL.createObjectURL(files[i]) })
            }
            setImageShow([...imageShow, ...imageUrl])
        }
    }
    
    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow
            let tempImages = images

            tempImages[index] = img
            tempUrl[index] = { url: URL.createObjectURL(img) }
            setImageShow([...tempUrl])
            setImages([...tempImages])
        }
    }

    const isClothesCategoryRef = useRef(false);

useEffect(() => {
    isClothesCategoryRef.current = category ? category.toLowerCase().includes('cloth') : false;
    console.log(state.category, 'category');
}, [category, state.category]);

const isClothesCategory = isClothesCategoryRef.current;


    const removeImage = (i) => {
        const filterImage = images.filter((img, index) => index !== i)
        const filterImageUrl = imageShow.filter((img, index) => index !== i)
        setImages(filterImage)
        setImageShow(filterImageUrl)
    }

    useEffect(() => {
        setAllCategory(categorys)
    }, [categorys])

    const add = (e) => {
        e.preventDefault();
    
        // Check if at least two images are selected
        if (images.length < 2) {
            toast.error("Please select at least two images.");
            return;
        }
    
        const formData = new FormData();
        formData.append('name', state.name);
        formData.append('description', state.description);
        formData.append('price', state.price);
        formData.append('stock', state.stock);
        formData.append('category', category);
        formData.append('discount', state.discount);
        formData.append('shopName', 'Farid Fashoin');
        formData.append('brand', state.brand);
        formData.append('colors', state.colors);
        formData.append('sizes', state.sizes);

        
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }
    
        dispatch(add_product(formData));
    };
    
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            setState({
                name: "",
                description: '',
                discount: '',
                price: "",
                brand: "",
                stock: "",
                colors:[],
                sizes:[]
            })
            setImageShow([])
            setImages([])
            setCategory('')

        }
    }, [successMessage, errorMessage, dispatch])

    return (
        <div className='px-2 lg:px-7 pt-5 '>
            <div className='w-full p-4  bg-[#283046] rounded-md'>
                <div className='flex justify-between items-center pb-4'>
                    <h1 className='text-[#d0d2d6] text-xl font-semibold'>Add Product</h1>
                    <Link className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 ' to='/seller/dashboard/products'>Products</Link>
                </div>
                <div>
                    <form onSubmit={add}>
                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="name">Product name</label>
                                <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.name} type="text" placeholder='product name' name='name' id='name' />
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="brand">Product brand</label>
                                <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.brand} type="text" placeholder='product brand' name='brand' id='brand' />
                            </div>
                        </div>
                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                            <div className='flex flex-col w-full gap-1 relative'>
                                <label htmlFor="category">Category</label>
                                <input readOnly onClick={() => setCateShow(!cateShow)} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={category} type="text" placeholder='--select category--' id='category' />
                                <div className={`absolute top-[101%] bg-slate-800 w-full transition-all ${cateShow ? 'scale-100' : 'scale-0'}`}>
                                    <div className='w-full px-4 py-2 fixed'>
                                        <input value={searchValue} onChange={categorySearch} className='px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden' type="text" placeholder='search' />
                                    </div>
                                    <div className='pt-14'></div>
                                    <div className='flex justify-start items-start flex-col h-[200px] overflow-x-scroll'>
                                        {
                                            allCategory.map((c, i) => <span key={i} className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${category === c.name && 'bg-indigo-500'}`} onClick={() => {
                                                setCateShow(false)
                                                setCategory(c.name)
                                                setSearchValue('')
                                                setAllCategory(categorys)
                                            }}>{c.name}</span>)
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="stock">Stock</label>
                                <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.stock} type="number" min='0' placeholder='product stock' name='stock' id='stock' />
                            </div>
                        </div>

                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="price">Price</label>
                                <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.price} type="number" placeholder='price' name='price' id='price' />
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="discount">Discount</label>
                                <input min='0' className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.discount} type="number" placeholder='%discount%' name='discount' id='discount' />
                            </div>
                        </div>
                        <div className='flex flex-col w-full gap-1 text-[#d0d2d6] mb-5'>
                            <label htmlFor="description">Description</label>
                            <textarea rows={4} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.description} placeholder='description' name='description' id='description'></textarea>
                        </div>
                        <div className='flex gap-5'>
                        
             <div className='w-1/2 text-[#d0d2d6] mb-5'> 
                <label htmlFor="colors">Colors</label>
             <Select
                primaryColor='indego'
                value={state.colors.map(color => ({ value: color, label: color }))}
                onChange={handleColorChange}
                options={colorOptions}
                isMultiple={true}
                placeholder="Select colors"
            />
             </div>
            <div className='w-1/2 text-[#d0d2d6]'>
            <label htmlFor="colors">Sizes</label>
            {isClothesCategory ? (
                <Select
                    
                    value={state.sizes.map(size => ({ value: size, label: size }))}
                    onChange={handleSizeChange}
                    options={sizeOptions}
                    isMultiple={true}
                    placeholder="Select sizes"
                />
            ) : (
                <input
                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
                    type="number"
                    value={state.sizes}
                    onChange={e => setState({ ...state, sizes: [e.target.value] })}
                    placeholder="Enter size"
                />
            )}
            </div>
                        </div>
                        <div className='grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#d0d2d6] mb-4'>
                            {
                                imageShow.map((img, i) => <div key={i} className='h-[180px] relative'>
                                    <label htmlFor={i}>
                                        <img className='w-full h-full rounded-sm' src={img.url} alt="" />
                                    </label>
                                    <input onChange={(e) => changeImage(e.target.files[0], i)} type="file" id={i} className='hidden' />
                                    <span onClick={() => removeImage(i)} className='p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full'><IoCloseSharp /></span>
                                </div>
                                )
                            }
                            <label className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#d0d2d6]' htmlFor="image">
                                <span><BsImages /></span>
                                <span>select image</span>
                            </label>
                            <input multiple onChange={inmageHandle} className='hidden' type="file" id='image' />
                        </div>
                        <div className='flex'>
                            <button disabled={loader ? true : false} className='bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                                {
                                    loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Add product'
                                }
                            </button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProduct