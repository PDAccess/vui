import moment from 'moment'

const momentFilter = (value, format, humanize=true) => {
    if (!value) {
        return ''
    }

    if (!format) {
        return value
    }

    if (format == 'duration') {
        let start_time = moment(value[0]);
        let end_time = moment(value[1]);
        let diff_time = end_time.diff(start_time);
        let duration = moment.duration(diff_time);
        let diff;
        if (humanize) {
            diff = duration.humanize()
        } else {
            diff = "";
            diff += duration.years() == 0 ? "" : duration.years() + " year ";
            diff += duration.months() == 0 ? "" : duration.months() + " month ";
            diff += duration.weeks() == 0 ? "" : duration.weeks() + " week ";
            diff += duration.days() == 0 ? "" : duration.days() + " day ";
            diff += duration.hours() == 0 ? "" : duration.hours() + " hour ";
            diff += duration.minutes() == 0 ? "" : duration.minutes() + " minute ";
            diff += duration.seconds() == 0 ? "" : duration.seconds() + " second";
        }
        
        return diff;
    } else if (format == 'from') {
            return  moment(value).fromNow()
    } else if (format == 'calendar') {
            return moment(value).calendar()
    } else {
            return moment(value).format(format)
    }
}

export default momentFilter;