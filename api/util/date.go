package util

import "time"

var (
	FullFormat = "Monday, 02-Jan-06 15:04:05"
	DateFormat = "2006-01-02"
	YearFormat = "2006"
)

// DateNow returns a DateFormatted Now
func DateNow() string {
	return time.Now().Format(DateFormat)
}
