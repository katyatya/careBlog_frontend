import React from 'react'
import styles from './TagsBlock.module.scss'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'

export const TagsBlock = ({ items, isLoading = true }) => {
	return (
		<ul className={styles.list}>
			{(isLoading ? [...Array(5)] : items).map(
				(name, i) =>
					name !== '' && (
						<Link to={`/tags/${name}`} className={styles.item}>
							<li key={i} disablePadding>
								{isLoading ? <Skeleton width={100} /> : <p>{name}</p>}
							</li>
						</Link>
					)
			)}
		</ul>
	)
}
