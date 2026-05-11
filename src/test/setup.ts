import { config } from '@vue/test-utils'

// Global Quasar plugin stub — allows mounting components
// that use Quasar features ($q, QBtn, etc.) in unit tests.
config.global.stubs = {
  QBtn: true,
  QInput: true,
  QSelect: true,
  QForm: true,
  QPage: true,
  QToolbar: true,
  QToolbarTitle: true,
  QHeader: true,
  QLayout: true,
  QDrawer: true,
  QPageContainer: true,
  QList: true,
  QItem: true,
  QItemSection: true,
  QItemLabel: true,
  QSeparator: true,
  QIcon: true,
  QTable: true,
  QInnerLoading: true,
  QSpinner: true,
  QDialog: true,
  QCard: true,
  QCardSection: true,
  QCardActions: true,
  QSpace: true,
  QMenu: true,
  QAvatar: true,
}
