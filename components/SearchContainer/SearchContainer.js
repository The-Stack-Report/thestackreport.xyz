import React, { useState, useEffect, useContext } from "react"
import {
    Text,
    Button,
    SimpleGrid,
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Spinner,
    Center,
    Select
} from "@chakra-ui/react"
import useDebounce from "utils/hooks/useDebounce"
import {
    SearchIcon
} from "@chakra-ui/icons"
import {
    insertUrlParam,
    getUrlParam,
    removeQueryParamsFromRouter
} from "utils/urlQueryParams"
import { useRouter } from 'next/router'
import _ from "lodash"
import { logEvent } from "utils/interactionLogging"


const SearchContainer = ({
    initialSearchTerm = "",
    searchBoxLabel = "Search",
    searchConstruct = "construct-unspecified",
    searchBoxPlaceholder = "Search",
    sortOptions = [],
    fallbackResults = [],
    debounceDelay = 500,
    searchData = (searchTerm) => {
        return []
    },
    renderResults = (searchResults) => {
        return []
    }
}) => {
    const [searchTerm, setSearchTerm] = React.useState(initialSearchTerm)
    const [searchResults, setSearchResults] = React.useState([])
    const [searching, setSearching] = React.useState(false)
    const [queriedSearchTerm, setQueriedSearchTerm] = useState(initialSearchTerm)
    const [query, setQuery] = useState(false)
    const [searchTermInitialized, setSearchTermInitialized] = useState(false)
    const [sortKey, setSortKey] = useState(_.get(sortOptions, "[0].key", false))
    const [queriedSortKey, setQueriedSortKey] = useState(_.get(sortOptions, "[0].key", false))
    const router = useRouter()


    useEffect(() => {
        if(initialSearchTerm !== "" && searchTermInitialized === false) {
            setSearchTerm(initialSearchTerm)
            setSearchTermInitialized(true)
        }
    }, [
        initialSearchTerm, 
        searchTermInitialized,
        searchTerm
    ])

    const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay)
    
    useEffect(() => {

        if(debouncedSearchTerm === "") {
            setQuery(false)
            setSearchResults(false)
            var search_term_param = getUrlParam("search_term")
            if(!_.isNull(search_term_param)) {
                removeQueryParamsFromRouter(router, ["search_term"])

            }
        }
        if(debouncedSearchTerm !== queriedSearchTerm) {
            setSearching(true)
            setQueriedSearchTerm(debouncedSearchTerm)
            router.push(
                insertUrlParam("search_term", debouncedSearchTerm),
                undefined,
                { shallow: true}
            )
            if(debouncedSearchTerm.length > 0) {
                logEvent({
                    category: "Search",
                    action: `Search for ${searchConstruct}`,
                    value: debouncedSearchTerm
                })
            }
            searchData(debouncedSearchTerm, sortKey).then((results) => {
                if(_.isArray(results)) {
                    setSearchResults(results)
                }
                setSearching(false)
            })
        }
    }, [
        debouncedSearchTerm,
        searchConstruct,
        queriedSearchTerm,
        sortKey,
        router,
        searchData
    ])

    useEffect(() => {
        if(sortKey !== queriedSortKey) {
            setQueriedSortKey(sortKey)
            setSearching(true)
            searchData(debouncedSearchTerm, sortKey).then((results) => {
                if(_.isArray(results)) {
                    setSearchResults(results)
                }
                setSearching(false)
            })
        }
    }, [sortKey, queriedSortKey, debouncedSearchTerm, searchData])

    const resultsToShow = _.isArray(searchResults) ? searchResults : fallbackResults

    return (
        <Box>
        <SimpleGrid
            columns={{sm: 1, md: 2}}
            marginTop="1rem"
            marginBottom="1rem"
            >
            <Box
                paddingRight="1rem"
                paddingBottom="1rem"
                >
                <Text
                    fontSize="0.7rem"
                    color="gray.500"
                    >
                    {searchBoxLabel}
                </Text>
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                    color='gray.300'
                    >
                    <SearchIcon color='gray.500' />
                </InputLeftElement>
                <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchBoxPlaceholder}
                    
                    />
                <InputRightElement
                    width="5rem"
                    >
                    <Button
                        h='1.75rem' size='sm' 
                        position="relative"
                        top="0.175rem"
                        right="0.4rem"
                        onPointerDown={() => {
                            setSearchTerm("")
                        }}
                        >
                        Clear
                    </Button>
                </InputRightElement>
            </InputGroup>
            </Box>
            {sortOptions.length > 0 && (
                <Box
                    maxW="400px"
                    >
                        <Text
                        fontSize="0.7rem"
                        color="gray.500"
                        >
                        Sorted by:
                    </Text>
                    <Select
                        onChange={(e) => {
                            setSortKey(e.target.value)
                        }}
                        >
                        {sortOptions.map(option => {
                            return (
                                <option
                                    value={option.key}
                                    key={option.key}
                                    >
                                    {option.label}
                                </option>
                            )
                        })}
                    </Select>
                </Box>
            )}
        </SimpleGrid>
        {searching ? (
            <Center h="300px">
                <Spinner />
            </Center>

        ) : (
            <Box>
                {renderResults(resultsToShow, {
                    searchTerm: searchTerm,
                    searchTermDebounced: debouncedSearchTerm,
                }, searching)}
            </Box>
        )}
        </Box>
    )
}

export default SearchContainer