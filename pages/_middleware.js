import { NextRequest, NextResponse } from 'next/server'

export default function testMiddleware(req, res, next) {
    const url = req.url
    console.log("test middleware: ", url)
    return NextResponse.rewrite(url)
}