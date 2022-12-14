import * as React from 'react'
import api from '../../apis'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CopyToClipboard from 'react-copy-to-clipboard'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import styled from '@emotion/styled'
import { createStyles, makeStyles } from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Avatar } from '@mui/material'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import {
  FilterList,
  Close,
  HelpOutline,
  CheckCircleOutline,
  ArrowForward,
  ArrowBack,
  ContentCopy,
  VisibilityOutlined,
  VisibilityOffOutlined,
  CheckCircle
} from '@mui/icons-material'

// local file
import info from '../../assets/icons/info.svg'
import styles from './index.module.scss'
import layer2 from '../../assets/icons/layer2.svg'
import help from '../../assets/icons/help.svg'
import { setProject } from '../../redux/slice/projectSlice'
import { light, dark } from '../../theme'
// import { useConnectWallet } from '@web3-onboard/react'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.warning.dark,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const PaletteDividerBg = styled.div(({ theme }) => ({
  background: `${theme.palette.divider}`
}))

const FilterSelect = styled(Select)(({ theme }) => ({
  boxSizing: 'border-box',
  color: theme.palette.common.black,
  borderRadius: '6px',
  backgroundColor: '#ffffff',
  width: '133px',
  height: '36px'
}))

const ProjectInfoPanel = styled(Stack)(({ theme }) => ({
  padding: '24px',
  marginTop: '12px',
  border: 'none',
  borderRadius: '8px',
  background: theme.palette.warning.dark,
  color: theme.palette.text.primary
}))

const ServiceLevel = styled(Stack)(({ theme }) => ({
  marginTop: '12px',
  color: theme.palette.common.black
}))

const BlackButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black
}))

const Step3Outer = styled(Stack)(({ theme }) => ({
  padding: '24px',
  marginTop: '12px',
  border: 'none',
  borderRadius: '8px',
  background: theme.palette.warning.dark,
  color: theme.palette.text.primary
}))

const PaymentInfo = styled(Stack)(({ theme }) => ({
  padding: '24px',
  marginTop: '12px',
  border: 'none',
  borderRadius: '8px',
  background: theme.palette.warning.dark,
  color: theme.palette.text.primary
}))

const useStyles = makeStyles(theme =>
  createStyles({
    table: {
      // minWidth: 650
    },
    sticky: {
      position: 'sticky',
      right: 0,
      //background: theme.palette.info.dark,
      padding: '10px',
      background: 'none !important'
    },
    cell: {
      width: '86px !important',
      borderBottom: `1px solid ${theme.palette.divider} !important`,
      whiteSpace: 'nowrap',
      textAlign: 'left',
      [theme.breakpoints.up(860)]: {
        width: '15% !important'
      }
    },
    rowInline: {
      [theme.breakpoints.up(860)]: {
        display: 'inline !important'
      }
    },
    key: {
      fontSize: '14px',
      [theme.breakpoints.down(576)]: {
        fontSize: '12px',
        wordWrap: 'break-word !important',
        width: '265px !important'
      }
    }
  })
)

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#F2F4F7 !important',
    color: theme.palette.primary.text
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const rows = [
  {
    ip: ['65.119.157.65', '02qb4032...'],
    networks: ['ETH', 'AVAX', 'BSC'],
    cost: [35, 200]
  },
  {
    ip: ['65.119.157.65', '02qb4032...'],
    networks: ['ETH', 'AVAX', 'BSC'],
    cost: [35, 200]
  },
  {
    ip: ['65.119.157.65', '02qb4032...'],
    networks: ['ETH', 'AVAX', 'BSC'],
    cost: [35, 200]
  },
  {
    ip: ['65.119.157.65', '02qb4032...'],
    networks: ['ETH', 'AVAX', 'BSC'],
    cost: [35, 200]
  },
  {
    ip: ['65.119.157.65', '02qb4032...'],
    networks: ['ETH', 'AVAX', 'BSC'],
    cost: [35, 200]
  }
]

const titles = [
  'New Project - Step 1 Title',
  'New Project - Step 2 Title',
  'New Project - Step 3 Title',
  'Title - Project Info',
  'Title - Cancel Project',
  'Title - Project Cancelled',
  'Title - Extend Project - Payment'
]

const filterlist = ['ETH', 'AVAX', 'BSC', 'SYS']

const hasNetwork = (row, filters) => {
  for (let i = 0; i < filters.length; ++i) {
    if (row.networks.findIndex(network => network === filters[i]) >= 0) {
      return true
    }
  }
  return false
}

const ProjectModal = props => {
  const { open, signature, handleClose } = props
  // const [{ wallet }] = useConnectWallet()

  const mode = useSelector(state => state.toogle.darkMode)
  const dispatch = useDispatch()
  const theme = mode === 'true' ? dark : light

  const classes = useStyles()

  const dots = [0, 1, 2]

  const [active, setActive] = useState(0)
  const [tabIndex, setTabIndex] = useState(0)
  const [newProj, setNewProj] = useState(null)
  const [serviceLevel, setServiceLevel] = useState(0)
  const [keyVisibility, setKeyVisibility] = useState(false)

  // const [scroll, setScroll] = React.useState<DialogProps['scroll']>('body');

  // const [loading, setLoading] = useState(false)

  const onClickDetail = async () => {
    if (signature) {
      const body = {
        id: 1,
        method: 'request_project',
        params: []
      }
      try {
        const result = await api.project.createProject(body)
        dispatch(setProject(result?.data?.result))
        setNewProj(result?.data?.result)
        setTabIndex(1)
      } catch (error) {
        console.log(typeof error?.message)
        toast(`Backend server error occured: ${error?.message}`)
      }
    }
  }

  const [copyFlag, setCopyFlag] = useState(false)

  useEffect(() => {
    if (tabIndex === 0) {
      setActive(0)
    } else if (tabIndex === 1) {
      setActive(1)
    } else {
      setActive(2)
    }
  }, [tabIndex])

  const [toFilter, setToFilter] = useState([])
  const [fromFilter, setFromFilter] = useState(filterlist)

  useEffect(() => {
    setActive(0)
    setTabIndex(0)
    setNewProj(null)
    setServiceLevel(0)
    setKeyVisibility(false)
    setCopyFlag(false)
    setToFilter([])
    setFromFilter(filterlist)
  }, [open])

  const handleChange = event => {
    let fromTemp = fromFilter
    let toTemp = toFilter

    toTemp.push(event.target.value)
    setToFilter(toTemp)
    fromTemp = fromFilter.filter(item => item !== event.target.value)
    setFromFilter(fromTemp)
  }

  const handleDelete = newValue => {
    let fromTemp = fromFilter
    let toTemp = toFilter

    fromTemp.push(newValue)
    setFromFilter(fromTemp)
    toTemp = toFilter.filter(item => item !== newValue)
    setToFilter(toTemp)
  }

  const recover = len => {
    const ch = '*'
    let pass = ''
    for (let i = 0; i < len; i++) pass += ch
    return pass
  }

  console.log('rows:', rows, toFilter)

  return (
    <div>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // scroll={scroll}
        className={styles.verticalScrollModal}
      >
        <Box className={styles.modalNewBox}>
          <Stack direction="row" justifyContent="flex-end">
            <Close className={styles.closeIcon} onClick={handleClose} />
          </Stack>
          <Typography
            id="modal-modal-title"
            variant="h2"
            component="h2"
            className={styles.title}
            color="common.black"
          >
            {tabIndex === 0
              ? titles[0]
              : tabIndex === 1
                ? titles[1]
                : titles[2]}
          </Typography>
          <PaletteDividerBg className={styles.divider} />
          <Typography className={`${styles.chooseLabel}`}>
            Your Project Details
          </Typography>
          <Typography
            className={`${styles.desc} ${styles.mb10}`}
            color="text.primary"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
            purus sit amet luctus venenatis, lectus magna fringilla urna,
            porttitor rhoncus dolor purus non.
          </Typography>
          {tabIndex === 0 && (
            <div className={styles.tab0}>
              <div className={styles.tableBox}>
                {/* <div className={styles.tableFilter} >
                    <Stack direction="row" spacing={1} sx={{ color: 'common.black' }}>
                      <Chip label="ETH" color="primary" sx={{ bgcolor: '#b9a7e1', color: '#7f56d9', fontWeight: 'bold' }} onDelete={handleDelete} />
                      <Chip label="AVAX" color="primary" onDelete={handleDelete} />
                      <Button variant='outlined'><FilterList />Filters</Button>
                    </Stack>
                  </div> */}

                <div className={styles.tableFilter}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    className={styles.gap}
                  >
                    {toFilter.map(item => (
                      <button className={styles.toModalFilterBtn} key={item}>
                        {item}{' '}
                        <Close
                          className={styles.smallCloseIcon}
                          onClick={() => handleDelete(item)}
                        />
                      </button>
                    ))}
                    <FilterSelect
                      id="demo-simple-select-autowidth"
                      value={0}
                      onChange={handleChange}
                      autoWidth
                    >
                      <MenuItem value={0} className={styles.hide}>
                        <Stack direction="row" gap="8px" alignItems="center">
                          <FilterList />
                          <div>Filters</div>
                        </Stack>
                      </MenuItem>
                      {fromFilter.map(item => (
                        <MenuItem
                          key={item}
                          value={item}
                          className={styles.menuItem}
                        >
                          {item}
                        </MenuItem>
                      ))}
                    </FilterSelect>
                  </Stack>
                </div>

                <TableContainer
                  component={Paper}
                  className={`${styles.tableBody} ${styles.fullWidth}`}
                >
                  <Table
                    className={styles.projectTable}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          className={`${styles.headItem} ${styles.headItem1}`}
                        >
                          Host Server IP
                          <img
                            src={help}
                            className={styles.helpIcon}
                            width="16px"
                            height="16px"
                            alt="help"
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          className={`${styles.headItem} ${styles.headItem2}`}
                        >
                          Supported Networks
                          <img
                            src={help}
                            className={styles.helpIcon}
                            width="16px"
                            height="16px"
                            alt="help"
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          className={`${styles.headItem} ${styles.headItem3}`}
                        >
                          Monthly cost
                          <img
                            src={help}
                            className={styles.helpIcon}
                            width="16px"
                            height="16px"
                            alt="help"
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          className={`${`${styles.headItem} ${styles.headItem4}`} ${classes.sticky}`}
                        >
                          Server info
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className={styles.whiteBg}>
                      {rows
                        .filter(
                          row =>
                            toFilter.length === 0 || hasNetwork(row, toFilter)
                        )
                        .map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                              <Stack direction="column">
                                <div className={styles.ip1}>{row.ip[0]}</div>
                                <div className={styles.ip2}>{row.ip[1]}</div>
                              </Stack>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Stack display="flex" gap="5px" flexDirection="row">
                                <Chip label="ETH" size="small" className={styles.chipEth} />
                                <Chip label="AVAX" size="small" className={styles.chipAvax} />
                                <Chip label="BSC" size="small" className={styles.chipBsc} />
                              </Stack>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Stack direction="column">
                                <div className={styles.tier}>
                                  Tier 1: ${row.cost[0]}
                                </div>
                                <div className={styles.tier}>
                                  Tier 2: ${row.cost[1]}
                                </div>
                              </Stack>
                            </StyledTableCell>
                            <StyledTableCell
                              align="left"
                              className={classes.sticky}
                            >
                              <Button
                                variant="contained"
                                className={styles.detailsButton}
                                onClick={onClickDetail}
                              >
                                <span className={styles.infoBtnSpace}>
                                  View details
                                </span>
                                <img src={info} alt="info" width={20} height={20} />
                              </Button>
                              <Button
                                variant="contained"
                                className={styles.infoMobile}
                                onClick={onClickDetail}
                              >
                                <img src={info} alt="info" width={15.7} height={15.7} />
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          )}
          {tabIndex === 1 && ( // Step 2
            <div className={styles.tab1}>
              <ProjectInfoPanel
                spacing={3}
                className={`${styles.projectInfoPanel} ${styles.mb30}`}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography className={styles.projectInfoLabel}>
                      Project ID:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>{1231212}</div>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography className={styles.projectInfoLabel}>
                      API Key:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span className={classes.key}>
                      {keyVisibility
                        ? newProj?.api_key
                        : recover(newProj?.api_key?.length)}
                    </span>
                    {keyVisibility ? (
                      <VisibilityOffOutlined
                        className={styles.cursorPointer}
                        onClick={() => setKeyVisibility(false)}
                      />
                    ) : (
                      <VisibilityOutlined
                        className={styles.cursorPointer}
                        onClick={() => setKeyVisibility(true)}
                      />
                    )}
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography className={styles.projectInfoLabel}>
                      Supported Networks:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={1}
                    className={styles.mixBlendMode}
                  >
                    <Chip
                      label="ETH"
                      size="small"
                      className={styles.darkChipEth}
                    />
                    <Chip
                      label="AVAX"
                      size="small"
                      className={styles.darkChipAvax}
                    />
                    <Chip
                      label="BSC"
                      size="small"
                      className={styles.darkChipBsc}
                    />
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography className={styles.projectInfoLabel}>
                      Accepted Payment Currencies:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>ETH, aaBLOCK, aBLOCK, BNB, AVAX</div>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  className={styles.apiKey}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography className={styles.projectInfoLabel}>
                      Host Server IP:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>65.119.157.65</div>
                </Stack>
              </ProjectInfoPanel>

              <Typography
                className={`${styles.chooseLabel} ${styles.marginTop}`}
                color="common.black"
              >
                Choose from one of the following service levels:
              </Typography>

              <ServiceLevel
                direction={'row'}
                justifyContent="space-between"
                className={styles.tierBody}
              >
                <div
                  className={`${styles.tier} ${serviceLevel === 0 ? styles.selectedTier : ''
                    }`}
                >
                  <div
                    className={`${styles.tierInner} ${serviceLevel === 0 ? styles.selectedTierInner : ''
                      } ${serviceLevel === 0 ? styles.selectedTierTitle : ''}`}
                  >
                    <Stack
                      direction="row"
                      justifyContent={'space-between'}
                      alignItems="center"
                      onClick={() => setServiceLevel(0)}
                      className={`${styles.cursorPointer} ${styles.borderBottom1} ${styles.fullWidth}`}
                    >
                      <Stack
                        direction={'row'}
                        justifyContent="space-between"
                        alignItems={'center'}
                        spacing={2}
                        className={styles.fullWidth}
                      >
                        <div className={styles.avatarContainer}>
                          <Avatar
                            alt="tie"
                            src={layer2}
                            className={styles.layersAvatar}
                          />{' '}
                        </div>
                        <div className={styles.tierTitle}>
                          <div className={styles.tierLetter}>Tier 1</div>
                          {serviceLevel === 1 ? (
                            <div className={styles.unchecked} />
                          ) : (
                            <CheckCircle className={styles.checked} />
                          )}
                        </div>
                      </Stack>
                    </Stack>
                  </div>

                  <div
                    className={`${styles.tierPadding} ${styles.whitBackground} ${styles.borderBottomRadius}`}
                  >
                    <Stack
                      className={styles.price}
                      direction="row"
                      alignItems="center"
                      justifyContent={'flex-start'}
                    >
                      <span>$35</span> 6 million calls
                    </Stack>
                    <Typography clasName={styles.description}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                      aliquam, purus sit.
                    </Typography>
                    <Stack
                      display="flex"
                      gap="5px"
                      flexDirection="row"
                      className={styles.mt20}
                    >
                      {/* {
                                  row.networks.map((network) => {
                                    return <Chip key={network} label={network} size='small' color="primary" />
                                  })
                                } */}
                      <Chip
                        label="ETH"
                        size="small"
                        className={styles.chipEth}
                      />
                      <Chip
                        label="AVAX"
                        size="small"
                        className={styles.chipAvax}
                      />
                      <Chip
                        label="BSC"
                        size="small"
                        className={styles.chipBsc}
                      />
                    </Stack>
                  </div>
                </div>

                <div
                  className={`${styles.tier} ${serviceLevel === 1 ? styles.selectedTier : ''
                    }`}
                >
                  <div
                    className={`${styles.tierInner} ${serviceLevel === 1 ? styles.selectedTierInner : ''
                      } ${serviceLevel === 1 ? styles.selectedTierTitle : ''}`}
                  >
                    <Stack
                      direction="row"
                      justifyContent={'space-between'}
                      alignItems="center"
                      onClick={() => setServiceLevel(1)}
                      className={`${styles.cursorPointer} ${styles.borderBottom1} ${styles.fullWidth}`}
                    >
                      <Stack
                        direction={'row'}
                        justifyContent="space-between"
                        alignItems={'center'}
                        spacing={2}
                        className={styles.fullWidth}
                      >
                        <div className={styles.avatarContainer}>
                          <Avatar
                            alt="tie"
                            src={layer2}
                            className={styles.layersAvatar}
                          />{' '}
                        </div>
                        <div className={styles.tierTitle}>
                          <div className={styles.tierLetter}>Tier 2</div>
                          {serviceLevel === 0 ? (
                            <div className={styles.unchecked} />
                          ) : (
                            <CheckCircle className={styles.checked} />
                          )}
                        </div>
                      </Stack>
                    </Stack>
                  </div>

                  <div
                    className={`${styles.tierPadding} ${styles.whitBackground} ${styles.borderBottomRadius}`}
                  >
                    <Stack
                      className={styles.price}
                      direction="row"
                      alignItems="center"
                      justifyContent={'flex-start'}
                    >
                      <span>$200</span> 32 million calls
                    </Stack>
                    <Typography clasName={styles.description}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                      aliquam, purus sit.
                    </Typography>
                    <Stack
                      display="flex"
                      gap="5px"
                      flexDirection="row"
                      className={styles.mt20}
                    >
                      {/* {
                                  row.networks.map((network) => {
                                    return <Chip key={network} label={network} size='small' color="primary" />
                                  })
                                } */}
                      <Chip
                        label="ETH"
                        size="small"
                        className={styles.chipEth}
                      />
                      <Chip
                        label="AVAX"
                        size="small"
                        className={styles.chipAvax}
                      />
                      <Chip
                        label="BSC"
                        size="small"
                        className={styles.chipBsc}
                      />
                    </Stack>
                  </div>
                </div>
              </ServiceLevel>
            </div>
          )}
          {tabIndex === 2 && ( // Step 3
            <div className={styles.tab2}>
              <ProjectInfoPanel
                spacing={3}
                className={`${styles.projectInfoPanel} ${styles.mb30}`}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography className={styles.projectInfoLabel}>
                      Project ID:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>{1231212}</div>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography className={styles.projectInfoLabel}>
                      Supported Networks:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={1}
                    className={styles.mixBlendMode}
                  >
                    <Chip
                      label="ETH"
                      size="small"
                      className={styles.darkChipEth}
                    />
                    <Chip
                      label="AVAX"
                      size="small"
                      className={styles.darkChipAvax}
                    />
                    <Chip
                      label="BSC"
                      size="small"
                      className={styles.darkChipBsc}
                    />
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  className={styles.mobileDisplay}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography className={styles.projectInfoLabel}>
                      Monthly cost in $USD:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div>$200</div>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  className={styles.apiKey}
                >
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={0.5}
                  >
                    <Typography className={styles.projectInfoLabel}>
                      Service Level:
                    </Typography>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <div className={styles.serviceLevel}>
                    <div className={styles.tierInServiceLevel}>Tier 2</div> - 32
                    million requests / month
                  </div>
                </Stack>
              </ProjectInfoPanel>
              <div className={styles.detail}>
                <Typography
                  className={`${styles.subTitle} ${styles.marginTopHalf}`}
                  color="common.black"
                >
                  Payment Info
                </Typography>
                <Typography className={styles.desc} color="text.primary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                  aliquam, purus sit amet luctus venenatis, lectus magna
                  fringilla urna, porttitor rhoncus dolor purus non.
                </Typography>
              </div>

              <PaymentInfo spacing={3}>
                {/* <div className={styles.info}> */}
                <Stack
                  direction={'row'}
                  justifyContent="space-between"
                  className={styles.amount}
                >
                  <Stack
                    direction="row"
                    justifyContent={'flex-start'}
                    className={styles.amountLeft}
                    spacing={1}
                  >
                    <div className={`${styles.subTItle} ${styles.m0}`}>
                      Amount to pay:
                    </div>
                    <HelpOutline sx={{ fontSize: '20px', color: '#98a2b3' }} />
                  </Stack>
                  <Stack
                    direction="column"
                    justifyContent={'flex-start'}
                    className={styles.amountRight}
                    alignItems={'flex-start'}
                  >
                    <div>
                      <span><b>aaBlock</b>: 19.652</span> (includes a 10% discount)
                    </div>
                    <div>
                      <span><b>aaBlock</b>: 21.342</span> (includes a 10% discount)
                    </div>
                    <div>
                      <span><b>aaBlock</b>: 0.23</span> (includes a 10% discount)
                    </div>
                    <div>
                      <span><b>aaBlock</b>: 0.21</span> (includes a 10% discount)
                    </div>
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  alignItems="center"
                  className={styles.payAddress}
                >
                  <Stack
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="center"
                    className={styles.amountLeft}
                    spacing={1}
                  >
                    <div className={`${styles.subTItle} ${styles.m0}`}>
                      Payment address:
                    </div>
                    {/* <HelpOutline sx={{ fontSize: '20px' }} /> */}
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="center"
                    className={`${styles.amountRight} ${styles.fullWidth}`}
                    spacing={1}
                  >
                    {/* <ContentCopy  /> */}
                    <CopyToClipboard
                      text={newProj?.payment_eth_address || ''}
                      onCopy={() => setCopyFlag(true)}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        className={styles.fullWidth}
                      >
                        <span className={classes.key}>
                          0x1576E561F2636e090cb855277eBA
                        </span>
                        {copyFlag ? (
                          <CheckCircleOutline
                            className={styles.cursorPointer}
                          />
                        ) : (
                          <ContentCopy className={styles.cursorPointer} />
                        )}
                      </Stack>
                    </CopyToClipboard>
                  </Stack>
                </Stack>
                <Typography className={`${styles.fontItalic}`}>
                  Text content to explain{' '}
                  <b className={styles.tierInServiceLevel}>
                    max 1 hour wait for pending tx
                  </b>{' '}
                  and what happens next after payment has been made.
                </Typography>
                {/* </div> */}
              </PaymentInfo>
            </div>
          )}

          <Stack
            direction={'row'}
            justifyContent="center"
            gap="10px"
            className={styles.dotsBody}
          >
            {dots.map((item, index) => {
              return (
                <button
                  key={index}
                  className={styles.dot}
                  style={{
                    backgroundColor: index === active ? '#b692f6' : '#e9d7fe'
                  }}
                ></button>
              )
            })}
          </Stack>

          {tabIndex === 0 && (
            <div className={`${styles.fullWidth} ${styles.contentCenter}`}>
              <BlackButton
                className={styles.cancelBtn}
                variant="outlined"
                onClick={handleClose}
              >
                Cancel
              </BlackButton>
            </div>
          )}

          {tabIndex === 1 && (
            <Stack direction={'row'} justifyContent="space-between">
              <BlackButton
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => {
                  setTabIndex(0)
                  setActive(0)
                }}
              >
                <Typography variant="h4">Go&nbsp;back</Typography>
              </BlackButton>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => setTabIndex(2)}
                className={styles.height44}
              >
                <Typography variant="h4">
                  Continue&nbsp;to&nbsp;payment
                </Typography>
              </Button>
            </Stack>
          )}

          {tabIndex === 2 && (
            <Stack
              direction={'row'}
              justifyContent="space-between"
              className={styles.marginTop}
            >
              <BlackButton
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => {
                  setTabIndex(1)
                  setActive(1)
                }}
              >
                <Typography variant="h4">Go&nbsp;back</Typography>
              </BlackButton>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => {
                  setTabIndex(0)
                  handleClose()
                }}
                className={styles.height44}
              >
                <Typography variant="h4">
                  Return&nbsp;to&nbsp;dashboard
                </Typography>
              </Button>
            </Stack>
          )}
        </Box>
      </Modal>
    </div>
  )
}

export default ProjectModal
