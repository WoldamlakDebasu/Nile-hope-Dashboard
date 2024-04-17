import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'
export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('image', image)
            const { data } = await api.post('/category-add', formData, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_category = createAsyncThunk(
    'category/get_category',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const categoryEdit = createAsyncThunk(
    'category/categoryEdit',
    async ({ id, updatedData }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.patch(`/category-edit/${id}`, updatedData, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const categoryDelete = createAsyncThunk(
    'category/categoryDelete',
    async (categoryId, { rejectWithValue }) => {
        try {
            await api.delete(`/category-delete/${categoryId}`,{ withCredentials: true });
            return categoryId;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        categorys: [],
        totalCategory : 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [categoryAdd.pending]: (state, _) => {
            state.loader = true
        },
        [categoryAdd.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [categoryAdd.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.categorys = [...state.categorys, payload.category]
        },
        [get_category.fulfilled]: (state, { payload }) => {
            state.totalCategory = payload.totalCategory
            state.categorys = payload.categorys
        },
        [categoryEdit.fulfilled]: (state, { payload }) => {
            const index = state.categorys.findIndex(category => category.id === payload.category.id);
            if (index !== -1) {
                state.categorys[index] = payload.category;
            }
        },
        [categoryDelete.fulfilled]: (state, { payload }) => {
            console.log('Before delete:', state.categorys);
            const index = state.categorys.findIndex(category => category.id === payload);
            if (index !== -1) {
                state.categorys.splice(index, 1);
            }
            console.log('After delete:', state.categorys);
        },
    }

})
export const { messageClear } = categoryReducer.actions
export default categoryReducer.reducer