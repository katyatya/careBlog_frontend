import React from 'react'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import ReactQuill, { Quill } from 'react-quill'
import quillEmoji from 'quill-emoji'
import 'react-quill/dist/quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'

import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../redux/slices/auth'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from '../../axios'

export const AddPost = () => {
	const { id } = useParams()
	const isAuth = useSelector(selectIsAuth)
	const navigate = useNavigate()
	const [text, setText] = React.useState('')
	const [title, setTitle] = React.useState('')
	const [tags, setTags] = React.useState('')
	const [imageUrl, setImageUrl] = React.useState('')
	const inputFileRef = React.useRef(null)
	const isEditing = Boolean(id)

	Quill.register(
		{
			'formats/emoji': quillEmoji.EmojiBlot,
			'modules/emoji-toolbar': quillEmoji.ToolbarEmoji,
			'modules/emoji-textarea': quillEmoji.TextAreaEmoji,
			'modules/emoji-shortname': quillEmoji.ShortNameEmoji,
		},
		true
	)

	const handleChangeFile = async event => {
		try {
			const formData = new FormData()
			const file = event.target.files[0]
			formData.append('image', file)
			const { data } = await axios.post('/upload', formData)
			setImageUrl(data.url)
		} catch (err) {
			console.warn(err)
			alert('Ошибка загрузки файла')
		}
	}

	const onClickRemoveImage = () => {
		setImageUrl('')
	}

	const onChange = text => {
		setText(text)
	}

	const onSubmit = async () => {
		try {
			const fields = {
				title,
				text,
				tags: tags.replace(/\s+/g, ' ').trim(),
				image_url: imageUrl,
			}

			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post('/posts', fields)

			const _id = isEditing ? id : data.post_id
			navigate(`/posts/${_id}`)
		} catch (err) {
			console.warn(err)
			alert(err.response.data[0].msg)
		}
	}

	React.useEffect(() => {
		if (id) {
			axios
				.get(`/posts/${id}`)
				.then(({ data }) => {
					setTitle(data.title)
					setText(data.text)
					setImageUrl(data.image_url)
					setTags(data.tags.join(','))
				})
				.catch(err => {
					alert('Ошибка загрузки статьи')
				})
		}
	}, [])

	const modules = {
		toolbar: [
			['bold', 'italic', 'underline'],
			[{ align: [] }],
			[{ color: [] }, { background: [] }],
			[{ size: ['small', false, 'large', 'huge'] }],
			[{ font: [] }],
			['emoji'],
		],
		'emoji-toolbar': true,
		'emoji-textarea': false,
		'emoji-shortname': true,
	}

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to='/' />
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputFileRef.current.click()}
				variant='outlined'
				size='large'
			>
				Загрузить превью
			</Button>
			<input
				ref={inputFileRef}
				type='file'
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl && (
				<>
					<Button
						variant='contained'
						color='error'
						onClick={onClickRemoveImage}
					>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
						alt='Uploaded'
					/>
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant='standard'
				placeholder='Заголовок статьи...'
				value={title}
				onChange={e => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant='standard'
				placeholder='Тэги (разделяйте пробелом)'
				value={tags}
				onChange={e => setTags(e.target.value)}
				fullWidth
			/>
			<ReactQuill
				className={styles.editor}
				modules={modules}
				theme='snow'
				value={text}
				onChange={onChange}
			/>

			<div className={styles.buttons}>
				<Button onClick={onSubmit} size='large' variant='contained'>
					{isEditing ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<a href='/'>
					<Button size='large'>Отмена</Button>
				</a>
			</div>
		</Paper>
	)
}
