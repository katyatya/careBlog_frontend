import React from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import styles from './Login.module.scss'
import { useForm } from 'react-hook-form'
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import axios from '../../axios'

export const Registration = () => {
	const inputFileRef = React.useRef(null)
	const [imageUrl, setImageUrl] = React.useState('')

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			full_name: '',
			email: '',
			password: '',
		},
		mode: 'all',
	})

	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)

	const handleChangeFile = async event => {
		try {
			const formData = new FormData()
			const file = event.target.files[0]
			formData.append('image', file)
			const { data } = await axios.post('/upload', formData)
			setImageUrl(data.url)
			console.log(data)
			// const reader = new FileReader()
			// reader.readAsDataURL(file)
			// reader.onload = e => {
			// 	window.localStorage.setItem('avatar_url', e.target.result)
			// }
		} catch (err) {
			console.warn(err)
			alert('Ошибка загрузки файла')
		}
	}

	const onSubmit = async params => {
		console.log(imageUrl)
		const updatedParams = {
			...params,
			avatar_url: imageUrl,
		}

		const data = await dispatch(fetchRegister(updatedParams))

		if (!data.payload) {
			alert(data.msg)
		} else if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token)
		}
	}

	if (isAuth) {
		return <Navigate to='/' />
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Создание аккаунта
			</Typography>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Button onClick={() => inputFileRef.current.click()} size='large'>
					<img
						className={styles.avatar}
						src={
							imageUrl
								? `${process.env.REACT_APP_API_URL}${imageUrl}`
								: 'noavatar.png'
						}
					/>
				</Button>
			</div>

			<input
				ref={inputFileRef}
				accept='.png,.jpg,.jpeg'
				type='file'
				onChange={handleChangeFile}
				hidden
			/>

			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					error={Boolean(errors.full_name?.message)}
					helperText={errors.full_name?.message}
					{...register('full_name', { required: 'Укажите имя и фамилию ' })}
					className={styles.field}
					label='Полное имя'
					fullWidth
				/>
				<TextField
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					{...register('email', { required: 'Укажите почту  ' })}
					className={styles.field}
					label='E-Mail'
					fullWidth
				/>
				<TextField
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: 'Укажите пароль ' })}
					className={styles.field}
					label='Пароль'
					fullWidth
				/>
				<Button
					disabled={!isValid}
					type='submit'
					size='large'
					variant='contained'
					fullWidth
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	)
}
