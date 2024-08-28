import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'

import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, fetchTags } from '../redux/slices/posts'

export const Home = () => {
	const dispatch = useDispatch()
	const { posts, tags } = useSelector(state => state.posts)
	const userData = useSelector(state => state.auth.data)
	const [value, setValue] = React.useState('1')
	const [homePosts, setHomePosts] = React.useState(posts.items || [])

	const isPostsLoading = posts.status === 'loading'
	const isTagsLoading = tags.status === 'loading'

	React.useEffect(() => {
		dispatch(fetchPosts())
		dispatch(fetchTags())
	}, [])

	React.useEffect(() => {
		if (posts.items) {
			setHomePosts(posts.items)
		}
	}, [posts.items])

	const handleChange = (event, newValue) => {
		setValue(newValue)
		if (newValue === '1') {
			setHomePosts(posts.items)
		} else {
			setHomePosts(posts.sortedItems)
		}
	}

	return (
		<>
			<Tabs
				onChange={handleChange}
				style={{ marginBottom: 15 }}
				value={value}
				aria-label='basic tabs example'
			>
				<Tab value='1' label='Все статьи' />
				<Tab value='2' label='Популярные' />
			</Tabs>
			<TagsBlock items={tags.items} isLoading={isTagsLoading} />
			<Grid container spacing={4}>
				{(isPostsLoading ? [...Array(5)] : homePosts).map((obj, index) =>
					isPostsLoading ? (
						<Grid key={index} item xs={12} sm={6} md={4} lg={4}>
							<Post key={index} isLoading={true} />
						</Grid>
					) : (
						<Grid key={index} item xs={12} sm={6} md={4} lg={4}>
							<Post
								id={obj.post_id}
								title={obj.title}
								user={obj.user}
								imageUrl={
									obj.image_url
										? `http://localhost:44455${obj.image_url}`
										: 'http://localhost:44455/uploads/no_image.png'
								}
								createdAt={obj.created_at}
								viewsCount={obj.views_count}
								tags={obj.tags ? obj.tags : ['..']}
								isEditable={userData?.user_id === obj.user.user_id}
							/>
						</Grid>
					)
				)}
			</Grid>
		</>
	)
}
