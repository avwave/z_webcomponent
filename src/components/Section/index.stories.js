import {Section, SectionHeader, SectionContent, SectionRow} from './'
import {Status} from './../Status'

const SectionStory = {
    title: "Section",
    component: Section
}

export default SectionStory

export const DefaultStory = ({...args}) => {
    return(
        <div>
            <Section>
                <SectionHeader title='Schedule Details'/>
                <SectionContent >
                    <SectionRow label={`Booking ID:`} value={`dgerrt56677292u412`} />
                    <SectionRow label={`Date Scheduled:`} value={`August 17, 2023 7:00:00 AM`} />
                    <SectionRow label={`Scheduled Status:`} style={{alignItems:'center'}} value={
                        <Status content='MATCHED' size='small' color="matched" />
                    } />
                    <SectionRow label="Confirmed" value='no'/>
                    <SectionRow label="Booking Fee" value="P350" />
                </SectionContent>
            </Section>
        </div>
    )
}