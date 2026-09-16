'use client';

import '@/modules/main/pages/main/index.scss';

import { Flex } from 'antd';

import { useNotesPage } from '@/modules/main/pages/main/hooks/use-notes-page';

import { FilterBar } from './components/filter-bar';
import { MainHeader } from './components/main-header';
import NoteModal from './components/note-modal';
import { NotesSection } from './components/notes-section';

const MainPage = () => {
  const {
    closeModal,
    createForm,
    editingNote,
    handleAddNote,
    handleEdit,
    handleFilterChange,
    handleSubmit,
    isModalOpen,
    isSubmitting,
    searchParams
  } = useNotesPage();

  return (
    <Flex vertical className="main-page" gap={10}>
      <MainHeader onAddNote={handleAddNote} />
      <FilterBar onFilterChange={handleFilterChange} />
      <NotesSection
        denseWeight={searchParams.denseWeight}
        searchQuery={searchParams.searchQuery}
        semanticLimit={searchParams.semanticLimit}
        sparseWeight={searchParams.sparseWeight}
        textWeight={searchParams.textWeight}
        useSemanticSearch={searchParams.useSemanticSearch}
        onEdit={handleEdit}
      />
      <NoteModal
        editingNote={editingNote}
        form={createForm}
        isLoading={isSubmitting}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </Flex>
  );
};

export default MainPage;
