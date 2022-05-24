import React from "react"
import ArticleCard from "components/ArticleCard"
import _ from "lodash"

const ArticleList = ({ articles }) => {
    return (
        <div>
            {articles.map(article => {
                return (
                    <ArticleCard
                        article={article}
                        key={article.id}
                        />
                )
            })}
        </div>
    )
}

export default ArticleList