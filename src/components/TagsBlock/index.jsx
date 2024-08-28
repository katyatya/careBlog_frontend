import React from 'react'
import styles from './TagsBlock.module.scss'
import Skeleton from '@mui/material/Skeleton'

export const TagsBlock = ({ items, isLoading = true }) => {
	return (
		<ul className={styles.list}>
			{(isLoading ? [...Array(5)] : items).map(
				(name, i) =>
					name !== '' && (
						<a className={styles.item} href={`/tags/${name}`}>
							<li key={i} disablePadding>
								{isLoading ? <Skeleton width={100} /> : <p>{name}</p>}
							</li>
						</a>
					)
			)}
		</ul>
	)
}
